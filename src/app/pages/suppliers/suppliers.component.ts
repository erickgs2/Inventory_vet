import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//========================================================
import { SuppliersService } from '../../services/suppliers.service';
import { ProductsService } from '../../services/product.service';
import { Product } from '../../objects/product';
import { Supplier } from '../../objects/supplier';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  suppliers: Supplier[];
  products: any[];
  _paramSuppCode = null
  curentSupplier: any = {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
    phone: '',
    products: []
  }
  currentProductList: Product[] = null

  constructor(
    private suppliersService: SuppliersService,
    private productsService: ProductsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams
      .subscribe(params => {
        this._paramSuppCode = params['supp']
      });
  }
  
  ngOnInit() {
    this.getSuppliersList();
  }
  getSuppliersList() {
    this.suppliersService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
          )
          )
          ).subscribe(suppliers => {
            this.suppliers = suppliers;
            if (this._paramSuppCode)
            this.curentSupplier = this.suppliers.filter(k => k.key == this._paramSuppCode)[0];
          });
          this.getProductssList();
  }


  deleteSupplier(key) {
    this.products.map(p => {
      if (p.prod_supp == key) {
        this.productsService
          .deleteProduct(p.key)
          .catch(err => console.log(err));
      }
    })
    this.suppliersService
      .deleteCustomer(key)
      .catch(err => console.log(err));


    setTimeout(() => {
      this.currentProductList = null;
      this.curentSupplier = {
        name: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        email: '',
        phone: '',
        products: []
      }
      this.showNotification('top', 'right', 'Proveedor eliminado correctamente')
      this.router.navigate(['/suppliers'])
      // this.getSuppliersList();
    }, 100);

  }

  SelectSupplier(supp: Supplier) {
    this.router.navigate(['/products'], { queryParams: { suppName: supp.name, suppCode:supp.key } });

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


  newSupplier() {
    this.router.navigate(['/newSupplier'], { queryParams: { type: "suppNew" } });
  }
  editSupplier(supp) {
    this.router.navigate(['/newSupplier'], { queryParams: { type: "suppEdit", supp: supp } });
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
        if (this._paramSuppCode)
          this.currentProductList = this.products.filter(x => x.prod_supp == this.curentSupplier.key);
      });
    }
    
    
    
    
  }
  