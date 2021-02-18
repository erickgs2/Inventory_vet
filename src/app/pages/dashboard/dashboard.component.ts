import { Component, OnInit } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

//========================================================
import { SuppliersService } from '../../services/suppliers.service';
import { Supplier } from '../../objects/supplier';
import { map } from 'rxjs/operators';


@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {

  suppliers: any;

  supp: Observable<Supplier[]>;
  key: BehaviorSubject<string>;

  curentSupplier: Supplier;
  newSupplier: Supplier = new Supplier();

  constructor(
    private suppliersService: SuppliersService,
    private toastr: ToastrService,
    private afs: AngularFirestore) { 

  
    }
    

  ngOnInit() {

  }
  //=============================================================================================

  getCustomersList() {
    this.suppliersService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(suppliers => {
      
    });
  }

  deleteCustomer(key) {
    this.suppliersService
      .deleteCustomer(key)
      .catch(err => console.log(err));
    this.showNotification('top', 'right', 'Proveedor eliminado correctamente')
  }

  newCustomer(): void {
    this.newSupplier = new Supplier();
  }

  save() {
    console.log(this.newSupplier)
    this.suppliersService.createCustomer(this.newSupplier);
    this.newSupplier = new Supplier();
  }

  onSubmit() {
    this.save();
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
