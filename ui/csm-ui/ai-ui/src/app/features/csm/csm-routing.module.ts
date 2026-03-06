import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsmListComponent } from './components/csm-list/csm-list.component';
import { CsmDetailComponent } from './components/csm-detail/csm-detail.component';
import { CsmEditComponent } from './components/csm-edit/csm-edit.component';

// NOTE: AuthGuard is already applied on the parent '/csm' route in app-routing-module.ts
const routes: Routes = [
    { path: '', component: CsmListComponent },
    { path: ':id/edit', component: CsmEditComponent },
    { path: ':id', component: CsmDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CsmRoutingModule { }
