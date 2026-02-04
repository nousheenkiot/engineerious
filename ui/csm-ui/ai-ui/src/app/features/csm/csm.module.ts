import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CsmRoutingModule } from './csm-routing.module';
import { CsmListComponent } from './components/csm-list/csm-list.component';
import { CsmDetailComponent } from './components/csm-detail/csm-detail.component';
import { CsmEditComponent } from './components/csm-edit/csm-edit.component';


@NgModule({
    declarations: [
        CsmListComponent,
        CsmDetailComponent,
        CsmEditComponent
    ],
    imports: [
        CommonModule,
        CsmRoutingModule,
        ReactiveFormsModule
    ]
})
export class CsmModule { }
