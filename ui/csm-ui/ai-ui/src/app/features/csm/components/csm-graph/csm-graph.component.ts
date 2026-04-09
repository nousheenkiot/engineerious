import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-csm-graph',
    standalone: false,
    templateUrl: './csm-graph.component.html',
    styleUrls: ['./csm-graph.component.css']
})
export class CsmGraphComponent implements OnInit, OnDestroy {
    @ViewChild('graphCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private worker!: Worker;
    private chartInstance: Chart | null = null;
    lastUpdated: Date | null = null;
    nextUpdateInSeconds = 120;
    private countdownInterval: any;

    constructor() { }

    ngOnInit(): void {
        this.initChart();
        this.initWorker();
        this.startCountdown();
    }

    ngOnDestroy(): void {
        if (this.worker) {
            this.worker.postMessage('STOP');
            this.worker.terminate();
        }
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    private initWorker(): void {
        if (typeof Worker !== 'undefined') {
            // Create a new web worker using modern module syntax
            this.worker = new Worker(new URL('./csm-graph.worker', import.meta.url), { type: 'module' });

            this.worker.onmessage = ({ data }) => {
                console.log('Main thread received graph data from Web Worker');
                this.updateChart(data);
                this.lastUpdated = new Date();
                this.nextUpdateInSeconds = 120; // reset countdown to 2 mins
            };

            // Start the worker
            this.worker.postMessage('START');
        } else {
            console.error('Web Workers are not supported in this environment.');
        }
    }

    private initChart(): void {
        const ctx = this.canvasRef.nativeElement.getContext('2d');
        if (!ctx) return;

        const config: ChartConfiguration = {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 800 },
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Live Cash Flow vs Recognized Profit Projection (Worker Thread)'
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        };

        this.chartInstance = new Chart(ctx, config);
    }

    private updateChart(data: any): void {
        if (this.chartInstance) {
            this.chartInstance.data = data;
            this.chartInstance.update();
        }
    }

    private startCountdown(): void {
        this.countdownInterval = setInterval(() => {
            if (this.nextUpdateInSeconds > 0) {
                this.nextUpdateInSeconds--;
            }
        }, 1000);
    }
}
