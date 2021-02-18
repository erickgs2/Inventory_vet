import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { SuppliersComponent } from 'src/app/pages/suppliers/suppliers.component';
import { CreateSupplierComponent } from 'src/app/pages/create-supplier/create-supplier.component';
import { InventoryComponent } from 'src/app/pages/inventory/inventory.component';
import { InventoryDetailComponent } from "src/app/pages/inventory-detail/inventory-detail.component";
import { ProductsComponent } from "src/app/pages/products/products.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "icons", component: IconsComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "user", component: UserComponent },
  { path: "tables", component: TablesComponent },
  { path: "typography", component: TypographyComponent },
  { path: "suppliers", component: SuppliersComponent },
  { path: "newSupplier", component: CreateSupplierComponent },
  { path: "inventory", component: InventoryComponent },
  { path: "inventoryDetail", component: InventoryDetailComponent },
  { path: "products", component: ProductsComponent },
  // { path: "rtl", component: RtlComponent }
];
