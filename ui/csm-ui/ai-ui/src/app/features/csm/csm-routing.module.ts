import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsmListComponent } from './components/csm-list/csm-list.component';
import { CsmDetailComponent } from './components/csm-detail/csm-detail.component';
import { AuthGuard } from '../../core/auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: CsmListComponent },
            { path: ':id', component: CsmDetailComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CsmRoutingModule { }
