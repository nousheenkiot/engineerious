import { Component, OnInit } from '@angular/core';
import { CsmService } from '../../services/csm.service';
import { ContractCsm } from '../../../../shared/models/contract-csm.model';

@Component({
    selector: 'app-csm-list',
    templateUrl: './csm-list.component.html',
    styleUrls: ['./csm-list.component.css']
})
export class CsmListComponent implements OnInit {
    contracts: ContractCsm[] = [];
    loading = true;

    // Pagination
    currentPage = 0;
    pageSize = 5; // Low size to demo pagination with small mock data
    totalPages = 0;
    totalElements = 0;

    constructor(private csmService: CsmService) { }

    ngOnInit(): void {
        this.loadContracts();
    }

    loadContracts(): void {
        this.loading = true;
        this.csmService.getContracts(this.currentPage, this.pageSize).subscribe({
            next: (page) => {
                this.contracts = page.content;
                this.totalPages = page.totalPages;
                this.totalElements = page.totalElements;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching contracts', err);
                this.loading = false;
            }
        });
    }

    onPageChange(page: number): void {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.loadContracts();
        }
    }
}
