import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsmRoutingModule } from './csm-routing.module';
import { CsmListComponent } from './components/csm-list/csm-list.component';
import { CsmDetailComponent } from './components/csm-detail/csm-detail.component';


@NgModule({
    declarations: [
        CsmListComponent,
        CsmDetailComponent
    ],
    imports: [
        CommonModule,
        CsmRoutingModule
    ]
})
export class CsmModule { }
