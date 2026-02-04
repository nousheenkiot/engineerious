export interface ContractCsm {
    id: string;
    contractId: string;
    portfolioId: string;
    initialCsm: number;
    currentCsm: number;
    currency: string;
    status: 'Active' | 'Closed' | 'Pending';
    startDate: Date;
    endDate: Date;
    fulfillmentCashFlows: number;
    riskAdjustment: number;
    lossComponent: number;
    coverageUnits: number;
    recognizedProfit: number;
}
