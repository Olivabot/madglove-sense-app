document.addEventListener('DOMContentLoaded', () => {
    const createLineChart = (ctx, label, yLabel) => {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: `${label} X`, data: [], borderColor: 'red', fill: false, tension: 0.4 },
                    { label: `${label} Y`, data: [], borderColor: 'green', fill: false, tension: 0.4 },
                    { label: `${label} Z`, data: [], borderColor: 'blue', fill: false, tension: 0.4 }
                ]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Time (ms)' } },
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: yLabel }
                    }
                },
                responsive: true,
                animation: { duration: 500, easing: 'easeOutQuad' },
                plugins: {
                    tooltip: { mode: 'nearest', intersect: false },
                    legend: { display: true }
                }
            }
        });
    };

    const imu1GyroChart = createLineChart(document.getElementById('imu1GyroChart').getContext('2d'), 'IMU1 Gyroscope', 'Rotation (°/s)');
    const imu2GyroChart = createLineChart(document.getElementById('imu2GyroChart').getContext('2d'), 'IMU2 Gyroscope', 'Rotation (°/s)');

    setInterval(() => {
        if (window.latestIMUData) {
            const timestamp = window.latestIMUData[0];

            const imu1GyroX = window.latestIMUData[6], imu1GyroY = window.latestIMUData[7], imu1GyroZ = window.latestIMUData[8];
            const imu2GyroX = window.latestIMUData[12], imu2GyroY = window.latestIMUData[13], imu2GyroZ = window.latestIMUData[14];

            const maxDataPoints = 50;

            // Update IMU1 Gyroscope Chart
            imu1GyroChart.data.labels.push(timestamp);
            imu1GyroChart.data.datasets[0].data.push(imu1GyroX);
            imu1GyroChart.data.datasets[1].data.push(imu1GyroY);
            imu1GyroChart.data.datasets[2].data.push(imu1GyroZ);
            if (imu1GyroChart.data.labels.length > maxDataPoints) {
                imu1GyroChart.data.labels.shift();
                imu1GyroChart.data.datasets.forEach(dataset => dataset.data.shift());
            }
            imu1GyroChart.update();

            // Update IMU2 Gyroscope Chart
            imu2GyroChart.data.labels.push(timestamp);
            imu2GyroChart.data.datasets[0].data.push(imu2GyroX);
            imu2GyroChart.data.datasets[1].data.push(imu2GyroY);
            imu2GyroChart.data.datasets[2].data.push(imu2GyroZ);
            if (imu2GyroChart.data.labels.length > maxDataPoints) {
                imu2GyroChart.data.labels.shift();
                imu2GyroChart.data.datasets.forEach(dataset => dataset.data.shift());
            }
            imu2GyroChart.update();
        }
    }, 100);
});
