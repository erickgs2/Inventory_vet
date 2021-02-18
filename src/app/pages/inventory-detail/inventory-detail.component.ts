import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SuppliersService } from '../../services/suppliers.service';
import { ProductsService } from '../../services/product.service';
import { Product } from '../../objects/product';
import { Supplier } from '../../objects/supplier';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit {

  
  suppliers: Supplier[];
  products: Product[];

  _paramSuppName = null;
  _paramSuppCode = null;

  currentProducts: Product[] = null
  currentProductsBackup = null
  seachInput = ''

  constructor(
    private suppliersService: SuppliersService,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
    .subscribe(params => {
      this._paramSuppName = params['suppName'];
      this._paramSuppCode = params['suppCode'];
    });
   }

  ngOnInit(): void {
    this.getProductssList();
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
      this.currentProducts = this.products.filter(p =>  p.prod_supp == this._paramSuppCode && p.prod_quantity != -1   );
      this.currentProductsBackup = this.products.filter(p =>  p.prod_supp == this._paramSuppCode && p.prod_quantity != -1   );
    });
  }

  filter(){
    this.currentProducts = this.currentProductsBackup.filter(p => 
      p.prod_name.toLowerCase().includes(this.seachInput.toLowerCase())
      
    )
  }

  add(prod) {
    prod.prod_quantity = prod.prod_quantity + 1
    // this.currentProducts.map(p => {
    //   if(p.key == prod.key)
    //     p.prod_quantity = p.prod_quantity + 1
    // })
    this.productsService.updateProduct(prod, prod.key);
  }

  remove(prod) {
    prod.prod_quantity = prod.prod_quantity == 0 ? 0 : prod.prod_quantity  - 1
    // this.currentProducts.map(p => {
    //   if(p.key == prod.key)
    //     p.prod_quantity = p.prod_quantity - 1
    // })
    this.productsService.updateProduct(prod, prod.key);
  }


}
