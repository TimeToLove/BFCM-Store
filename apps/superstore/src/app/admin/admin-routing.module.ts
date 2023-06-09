import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductsComponent } from "./products/list-products/list-products.component";
import { AdminComponent } from "./admin.component";
import { ListUsersComponent } from "./users/list-users/list-users.component";
import { ListOrdersComponent } from "./orders/list-orders/list-orders.component";

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'list-products',
                component: ListProductsComponent
            },
            {
                path: 'list-users',
                component: ListUsersComponent
            },
            {
                path: 'list-orders',
                component: ListOrdersComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}