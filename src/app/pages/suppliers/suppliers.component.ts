import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//========================================================
import { SuppliersService } from '../../services/suppliers.service';
import { Supplier } from '../../objects/supplier';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  suppliers: any;
  curentSupplier: Supplier = {
    key: '',
    name: '-',
    address:'-',
    city:'-',
    state:'-',
    postalCode:'',
    email:'-',
    phone:'-',
    products: []
  }

  constructor(
    private suppliersService: SuppliersService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.getCustomersList();
  }

  getCustomersList() {
    this.suppliersService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(suppliers => {
      this.suppliers = suppliers;
    });
  }

  deleteSupplier(key) {
    this.suppliersService
      .deleteCustomer(key)
      .catch(err => console.log(err));
     this.showNotification('top', 'right', 'Proveedor eliminado correctamente')
  }
  deleteProd(key, index) {
    var temp = this.curentSupplier.products
    temp.splice(index, 1);
    this.suppliersService.deleteProd(key, temp);

    this.curentSupplier = this.suppliers.filter(k => k.key == key )[0];
     this.showNotification('top', 'right', 'Proveedor eliminado correctamente');
  }
  editSupplier(supp) {
    this.router.navigate(['/newSupplier'],  { queryParams: { supp: supp} });
  }
  newSupplier() {
    this.router.navigate(['/newSupplier'] ,  { queryParams: { type: "new"}});
  }
  newProduct(supp, name) {
    this.router.navigate(['/newSupplier'],  { queryParams: { supp: supp, type: "prodNew", suppName:name } });
  }
  editProduct(supp, index, name) {
    this.router.navigate(['/newSupplier'],  { queryParams: { supp: supp, type: "prodEdit", index:index , suppName:name} });
  }

  SelectSupplier(supp: Supplier){
    this.curentSupplier = supp;
  }

  showNotification(from, align, title){

    this.toastr.success('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> '+title+'.', '', {
       disableTimeOut: false,
       closeButton: true,
       enableHtml: true,
       toastClass: "alert alert-success alert-with-icon",
       positionClass: 'toast-' + from + '-' +  align
     });

}



}
