import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


import { SuppliersService } from '../../services/suppliers.service';
import { ProductsService } from '../../services/product.service';
import { Product } from '../../objects/product';
import { Supplier } from '../../objects/supplier';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  _paramSuppName = '';
  _paramSuppCode = '';

  products: any[];
  currentProductList: Product[] = null


  constructor(
    private suppliersService: SuppliersService,
    private productsService: ProductsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams
    .subscribe(params => {
      this._paramSuppName = params['suppName']
      this._paramSuppCode = params['suppCode']
    });
   }

  ngOnInit(): void {
    this.getProductssList()
  }

  getProductssList() {
    this.productsService.getProductsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(products => {
      this.products = products;
      this.currentProductList = this.products.filter(x => x.prod_supp == this._paramSuppCode);
    });
  }

  newProduct(supp) {
    this.router.navigate(['/newSupplier'], { queryParams: { type: "prodNew", supp: supp } });
  }

  editProduct(supp, prod) {
    this.router.navigate(['/newSupplier'], { queryParams: { type: "prodEdit", supp: supp, prod: prod } });
  }

  deleteProd(key, supp) {
    this.productsService
      .deleteProduct(key)
      .catch(err => console.log(err));
    setTimeout(() => {
      this.currentProductList = this.products.filter(x => x.prod_supp == this._paramSuppCode);
      this.showNotification('top', 'right', 'Producto eliminado correctamente');
    }, 20);

  }

  showNotification(from, align, title) {

    this.toastr.success('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> ' + title + '.', '', {
      disableTimeOut: false,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-success alert-with-icon",
      positionClass: 'toast-' + from + '-' + align
    });
  }

}
