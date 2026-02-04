import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CsmService } from '../../services/csm.service';
import { ContractCsm } from '../../../../shared/models/contract-csm.model';

@Component({
    selector: 'app-csm-edit',
    templateUrl: './csm-edit.component.html',
    styleUrls: ['./csm-edit.component.css']
})
export class CsmEditComponent implements OnInit {
    editForm: FormGroup;
    contractId: string | null = null;
    loading = true;
    saving = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private csmService: CsmService
    ) {
        this.editForm = this.fb.group({
            contractId: [{ value: '', disabled: true }],
            portfolioId: [{ value: '', disabled: true }],
            currency: [{ value: '', disabled: true }],
            status: ['', Validators.required],
            currentCsm: [0, [Validators.required, Validators.min(0)]],
            riskAdjustment: [0, [Validators.required, Validators.min(0)]],
            lossComponent: [0, [Validators.min(0)]],
            fulfillmentCashFlows: [0, Validators.required],
            recognizedProfit: [0]
        });
    }

    ngOnInit(): void {
        this.contractId = this.route.snapshot.paramMap.get('id');
        if (this.contractId) {
            this.csmService.getContract(this.contractId).subscribe({
                next: (data) => {
                    if (data) {
                        this.editForm.patchValue(data);
                        this.loading = false;
                    } else {
                        this.error = 'Contract not found';
                        this.loading = false;
                    }
                },
                error: (err) => {
                    this.error = 'Error loading contract';
                    this.loading = false;
                }
            });
        }
    }

    onSubmit(): void {
        if (this.editForm.valid && this.contractId) {
            this.saving = true;
            const updatedValues = this.editForm.getRawValue() as ContractCsm;

            this.csmService.updateContract(this.contractId, updatedValues).subscribe({
                next: () => {
                    this.saving = false;
                    this.router.navigate(['/csm']);
                },
                error: (err) => {
                    this.error = 'Error saving contract';
                    this.saving = false;
                }
            });
        }
    }

    cancel(): void {
        this.router.navigate(['/csm']);
    }
}
