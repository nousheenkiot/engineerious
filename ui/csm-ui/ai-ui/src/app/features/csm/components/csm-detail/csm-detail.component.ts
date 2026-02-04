import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsmService } from '../../services/csm.service';
import { ContractCsm } from '../../../../shared/models/contract-csm.model';

@Component({
    selector: 'app-csm-detail',
    templateUrl: './csm-detail.component.html',
    styleUrls: ['./csm-detail.component.css']
})
export class CsmDetailComponent implements OnInit {
    contract: ContractCsm | undefined;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private csmService: CsmService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.csmService.getContract(id).subscribe({
                next: (data) => {
                    this.contract = data;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error fetching contract', err);
                    this.loading = false;
                }
            });
        }
    }
}
