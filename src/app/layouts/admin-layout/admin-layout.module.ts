import { Directive, NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { SuppliersComponent } from '../../pages/suppliers/suppliers.component';
import { CreateSupplierComponent } from '../../pages/create-supplier/create-supplier.component';
import { InventoryComponent } from '../../pages/inventory/inventory.component';
import { ProductsComponent } from '../../pages/products/products.component';
// import { RtlComponent } from "../../pages/rtl/rtl.component";
import { AngularFireModule} from '@angular/fire'
import { AngularFirestoreModule} from '@angular/fire/firestore'
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { InventoryDetailComponent } from "src/app/pages/inventory-detail/inventory-detail.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TablesComponent,
    IconsComponent,
    TypographyComponent,
    NotificationsComponent,
    SuppliersComponent, 
    CreateSupplierComponent,
    InventoryComponent, 
    InventoryDetailComponent,
    ProductsComponent
    // RtlComponent
  ]
})
export class AdminLayoutModule {}
