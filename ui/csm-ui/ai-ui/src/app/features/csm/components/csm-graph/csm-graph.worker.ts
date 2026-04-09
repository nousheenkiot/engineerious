/// <reference lib="webworker" />

// This worker listens for start/stop commands and emits graph data every 2 minutes.
let intervalId: any;

addEventListener('message', ({ data }) => {
    if (data === 'START') {
        // Immediately send the first batch
        generateAndSendGraphData();

        // Then set interval for every 2 minutes (120,000 ms)
        intervalId = setInterval(() => {
            generateAndSendGraphData();
        }, 120000);
    } else if (data === 'STOP') {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
});

function generateAndSendGraphData() {
    const now = new Date();
    const timeLabels = [];
    const dataset1 = [];
    const dataset2 = [];

    // Generate some past dummy data up to 'now'
    for (let i = 10; i >= 0; i--) {
        const point = new Date(now.getTime() - i * 120000);
        timeLabels.push(point.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        // Some random walk data for two lines
        dataset1.push(Math.floor(Math.random() * 500) + 100);
        dataset2.push(Math.floor(Math.random() * 300) + 50);
    }

    const payload = {
        labels: timeLabels,
        datasets: [
            {
                label: 'Recognized Profit',
                data: dataset1,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Fulfillment Cash Flows',
                data: dataset2,
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                tension: 0.4,
                borderDash: [5, 5]
            }
        ]
    };

    postMessage(payload);
}
