import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { isEmpty, map } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//========================================================
import { SuppliersService } from '../../services/suppliers.service';
import { ProductsService } from '../../services/product.service';
import { Product } from '../../objects/product';
import { Supplier } from '../../objects/supplier';
import { empty } from 'rxjs';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';


@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss']
})


export class CreateSupplierComponent implements OnInit {

  suppliers: Supplier[];
  suppliersReady: boolean = false;
  products: any[];
  productsReady: boolean = false;

  _paramSuppCode = null
  _paramReason = null;
  _paramIndex = null;
  _paramProdCode = null;
  suppName = null;

  newProd: Product = new Product();




  newSupplier: Supplier = new Supplier();
  editSupplier: Supplier = new Supplier();
  editProd: Product = new Product();


  tempSuppliers = null;


  constructor(
    private suppliersService: SuppliersService,
    private productsService: ProductsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams
      .subscribe(params => {
        this._paramIndex = params['index']
        this._paramSuppCode = params['supp']
        this._paramProdCode = params['prod']
        this._paramReason = params['type'];

        this.defineAction();
      });
  }


  ngOnInit(): void {
    this.productsService.getProductsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(products => {
      this.products = products;
      this.productsReady = true;
      this.defineAction()
    });
    this.suppliersService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(suppliers => {
      this.suppliers = suppliers;
      this.suppliersReady = true
      this.defineAction()
    });
  }


  defineAction() {
    if (this.suppliersReady && this.productsReady)
      switch (this._paramReason) {
        case "suppNew":
          this.editSupplier = {
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
          break;
        case "suppEdit":
          var temp = this.suppliers.filter(i => i.key == this._paramSuppCode);
          this.editSupplier = temp[0]
          break;
        case "prodNew":
          var tempSUpp1 = this.suppliers.filter(k => k.key == this._paramSuppCode)[0];
          this.suppName = tempSUpp1.name
          this.newProd = {
            prod_code: '',
            prod_name: '',
            prod_brand: '',
            prod_price: '',
            prod_supp: '',
            prod_quantity: 0
          }
          break;
        case "prodEdit":
          var tempSUpp = this.suppliers.filter(k => k.key == this._paramSuppCode)[0];
          var tempProd = this.products.filter(k => k.key == this._paramProdCode)[0];
          this.suppName = tempSUpp.name
          this.editProd = tempProd;
          break;
      }

  }



  onSubmitProd() {
    this.saveProd();
  }
  saveProd() {
    if (this.validateProd(this.newProd)) {
      this.newProd.prod_supp = this._paramSuppCode;
      this.productsService.createProduct(this.newProd);
      this.newProd = new Product();
      this.showNotification('top', 'right', 'Producto ingresado correctamente')

      this.goBackProd()
    }
  }


  onSubmitUpdate() {
    this.update();
  }
  update() {
    if (this.validateSupp(this.editSupplier)) {
      this.suppliersService.updateCustomer(this.editSupplier);
      this.editSupplier = new Supplier();
      this.showNotification('top', 'right', 'Proveedor actualizado correctamente')

      this.goBack()
    }
  }


  onSubmitUpdateProd() {
    this.updateProd();
  }
  updateProd() {
    if (this.validateProd(this.editProd)) {
      console.log(this.editProd.prod_price)
      this.productsService.updateProduct(this.editProd, this._paramProdCode);
      this.editProd = new Product();
      this.showNotification('top', 'right', 'Producto actualizado correctamente')
      this.goBackProd()
    } else {

    }

  }


  onSubmit() {
    if (this.validateSupp(this.newSupplier)) {
      console.log('entra')
      this.save();
    }
  }
  save() {

    this.suppliersService.createCustomer(this.newSupplier);
    this.newSupplier = new Supplier();
    this.showNotification('top', 'right', 'Proveedor ingresado correctamente')

    this.router.navigate(['/suppliers']);

  }
  goBack() {
    this.router.navigate(['/suppliers'], { queryParams: { supp: this._paramSuppCode } });
  }
  goBackProd() {
    this.router.navigate(['/products'], { queryParams: { suppCode: this._paramSuppCode, suppName: this.suppName } });
  }
  validateSupp(supp): boolean {
    if (supp.name != undefined) {
      if (supp.name != '')
        return true
      else {
        this.showError('top', 'right', 'Ingrese un nombre de proveedor')
        return false
      }
    } else {
      this.showError('top', 'right', 'Ingrese un nombre de proveedor')
      return false
    }
  }

  validateProd(prod: Product): boolean {
    if (
      prod.prod_name != '' &&
      prod.prod_code != '' &&
      prod.prod_price.length != 0 &&
      Number.isFinite(parseInt(prod.prod_price))
    ) {
      return true;
    } else {
      if (prod.prod_name == '') {
        this.showError('top', 'right', 'Ingrese un nombre de producto')
      }
      if (prod.prod_code == '') {
        this.showError('top', 'right', 'Ingrese un codigo de producto')
      }
      if (!Number.isFinite(parseInt(prod.prod_price))) {
        if (prod.prod_price.length == 0) {
          this.showError('top', 'right', 'Ingrese un precio de producto')
        } else {
          this.showError('top', 'right', 'El precio del producto debe contener solo numeros')
        }
      }
      return false;

    }
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

  showError(from, align, title) {

    this.toastr.error('<span class="tim-icons icon-alert-circle-exc" [data-notify]="icon"></span> ' + title + '.', '', {
      disableTimeOut: false,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-error alert-with-icon",
      positionClass: 'toast-' + from + '-' + align
    });
  }
}
