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
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {


  suppliers: any[];
  suppliersBackup = null
  products: any[];

  seachInput = ''

  _paramSuppCode = null;

  currentProductList: Product[] = null
  curentSupplier: Supplier = {
    key: '',
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
    phone: '',
    products: []
  }

  suppCounts:any = {};

  constructor(
    private suppliersService: SuppliersService,
    private productsService: ProductsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.route.queryParams
      .subscribe(params => {
        this._paramSuppCode = params['supp']
      });
  }

  ngOnInit(): void {
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
      this.suppliersBackup = suppliers;
      if (this._paramSuppCode)
        this.curentSupplier = this.suppliers.filter(k => k.key == this._paramSuppCode)[0];
      this.getProductssList();
    });
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
      this.products.map(p => {
        var temp = p.prod_supp+''
        var tempQ = p.prod_quantity==-1?0:p.prod_quantity
        if(this.suppCounts[temp] == undefined){
          this.suppCounts[temp] = {productCount:1, totalCount: tempQ }
        }else{
          this.suppCounts[temp].productCount +=1  ;
          this.suppCounts[temp].totalCount += tempQ;
        }
      })
    });
  }


  filter(){
    this.suppliers = this.suppliersBackup.filter(p => 
      p.name.toLowerCase().includes(this.seachInput.toLowerCase())
      
    )
  }

  SelectSupplier(suppCode, suppName){
      this.router.navigate(['/inventoryDetail'], { queryParams: { suppCode: suppCode, suppName: suppName } });
  }
}
