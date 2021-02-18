import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//========================================================
import { SuppliersService } from '../../services/suppliers.service';
import { Product, Supplier } from '../../objects/supplier';


@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss']
})


export class CreateSupplierComponent implements OnInit {

  newSupplier: Supplier = new Supplier();
  newProd: Product = new Product();
  editSupplier: Supplier = new Supplier();
  editProd: Product = new Product();
  suppCode = null
  reason = null;
  suppName = null;
  tempSuppliers = null;
  editProdIndex = null;

  constructor(
    private suppliersService: SuppliersService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) { }


  ngOnInit(): void {
    
    this.suppliersService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(suppliers => {
      this.tempSuppliers  = suppliers
      this.route.queryParams
      .subscribe(params => {
        this.editProdIndex = params['index']
        this.suppCode = params['supp']
        this.suppName = params['suppName'];


        if (params['supp'] && params['type']!='prodNew') {
          this.reason = params['type']=='prodEdit' ? 'prodEdit' :"edit";
          if(params['type']=='prodEdit'){
            var temp = this.tempSuppliers.filter(k => k.key == this.suppCode)[0];
            this.editProd = temp.products[params['index']]
          }
          var temp = this.tempSuppliers.filter(i => i.key == params['supp']);
          this.editSupplier = temp[0]
        } else if (params['type']=='prodNew'){
          this.reason = "prodNew"
          
          this.editProd = {
            prod_code:'',
            prod_name:'',
            prod_brand:'',
            prod_price:''
          }
        }else{
          this.reason = "new"
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
        }

      });
    });

   
  }

  newCustomer(): void {
    this.newSupplier = new Supplier();
  }

  save() {
    this.suppliersService.createCustomer(this.newSupplier);
    this.newSupplier = new Supplier();
    this.router.navigate(['/suppliers']);
  }
  saveProd() {
    var temp = this.tempSuppliers.filter(k => k.key == this.suppCode)[0];
    this.suppliersService.createProd(this.newProd, this.suppCode, temp.products ? temp.products.length: 0 );
    this.newProd = new Product();
    this.router.navigate(['/suppliers']);
  }
  update() {
    this.suppliersService.updateCustomer(this.editSupplier);
    this.editSupplier = new Supplier();
    this.router.navigate(['/suppliers']);
  }
  updateProd() {
    this.suppliersService.updateProd(this.suppCode, this.editProd, this.editProdIndex);
    this.editSupplier = new Supplier();
    this.router.navigate(['/suppliers']);
  }

  onSubmit() {
    this.save();
  }
  onSubmitProd() {
    this.saveProd();
  }
  onSubmitUpdateProd() {
    this.updateProd();
  }
  onSubmitUpdate() {
    this.update();
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
