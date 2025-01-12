document.addEventListener('DOMContentLoaded', () => {
    // Create Line Chart
    const createLineChart = (ctx, label, yLabel) => {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // Time labels
                datasets: [
                    { label: `${label} X`, data: [], borderColor: 'red', fill: false },
                    { label: `${label} Y`, data: [], borderColor: 'green', fill: false },
                    { label: `${label} Z`, data: [], borderColor: 'blue', fill: false }
                ]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 500, // Smooth animation
                    easing: 'easeOutQuad'
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Time (ms)' }
                    },
                    y: {
                        title: { display: true, text: yLabel },
                        suggestedMin: -2, // Adjusted for accelerometer/gyroscope range
                        suggestedMax: 2
                    }
                },
                plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true }
                }
            }
        });
    };

    // Initialize Charts
    const imu2AccelCtx = document.getElementById('imu2AccelChart').getContext('2d');
    const imu2GyroCtx = document.getElementById('imu2GyroChart').getContext('2d');

    const imu2AccelChart = createLineChart(imu2AccelCtx, 'Accel', 'Acceleration (g)');
    const imu2GyroChart = createLineChart(imu2GyroCtx, 'Gyro', 'Rotation (°/s)');

    // Real-time data update
    setInterval(() => {
        if (window.latestIMUData) {
            const timestamp = window.latestIMUData[0];
            const imu2AccelX = window.latestIMUData[9];
            const imu2AccelY = window.latestIMUData[10];
            const imu2AccelZ = window.latestIMUData[11];

            const imu2GyroX = window.latestIMUData[12];
            const imu2GyroY = window.latestIMUData[13];
            const imu2GyroZ = window.latestIMUData[14];

            const maxDataPoints = 50; // Rolling window size

            // Update Accelerometer Chart
            imu2AccelChart.data.labels.push(timestamp);
            imu2AccelChart.data.datasets[0].data.push(imu2AccelX);
            imu2AccelChart.data.datasets[1].data.push(imu2AccelY);
            imu2AccelChart.data.datasets[2].data.push(imu2AccelZ);

            // Limit Accelerometer Data Points
            if (imu2AccelChart.data.labels.length > maxDataPoints) {
                imu2AccelChart.data.labels.shift();
                imu2AccelChart.data.datasets.forEach(dataset => dataset.data.shift());
            }

            imu2AccelChart.update('none');

            // Update Gyroscope Chart
            imu2GyroChart.data.labels.push(timestamp);
            imu2GyroChart.data.datasets[0].data.push(imu2GyroX);
            imu2GyroChart.data.datasets[1].data.push(imu2GyroY);
            imu2GyroChart.data.datasets[2].data.push(imu2GyroZ);

            // Limit Gyroscope Data Points
            if (imu2GyroChart.data.labels.length > maxDataPoints) {
                imu2GyroChart.data.labels.shift();
                imu2GyroChart.data.datasets.forEach(dataset => dataset.data.shift());
            }

            imu2GyroChart.update('none');
        }
    }, 100); // Update every 100ms
});
