document.addEventListener('DOMContentLoaded', () => {
    const createInterpolationChart = (ctx, label) => {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // Time labels
                datasets: [
                    {
                        label: `${label} - Cubic Interpolation (monotone)`,
                        data: [], // IMU2 Accelerometer X
                        borderColor: 'red',
                        fill: false,
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4
                    },
                    {
                        label: `${label} - Cubic Interpolation`,
                        data: [], // IMU2 Accelerometer Y
                        borderColor: 'blue',
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: `${label} - Linear Interpolation`,
                        data: [], // IMU2 Accelerometer Z
                        borderColor: 'green',
                        fill: false,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Interpolation Modes for Accelerometer Data'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                interaction: {
                    intersect: false
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time (ms)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Acceleration (g)'
                        },
                        suggestedMin: -1.5,
                        suggestedMax: 1.5
                    }
                }
            }
        });
    };

    // Initialize the interpolation chart
    const imu2InterpolationCtx = document.getElementById('imu2InterpolationChart').getContext('2d');
    const imu2InterpolationChart = createInterpolationChart(imu2InterpolationCtx, 'IMU2 Accelerometer');

    // Real-time update for interpolation chart
    setInterval(() => {
        if (window.latestIMUData) {
            const timestamp = window.latestIMUData[0];
            const imu2AccelX = window.latestIMUData[9];
            const imu2AccelY = window.latestIMUData[10];
            const imu2AccelZ = window.latestIMUData[11];

            const maxDataPoints = 50; // Rolling window size

            // Add new data points
            imu2InterpolationChart.data.labels.push(timestamp);
            imu2InterpolationChart.data.datasets[0].data.push(imu2AccelX); // X-axis data
            imu2InterpolationChart.data.datasets[1].data.push(imu2AccelY); // Y-axis data
            imu2InterpolationChart.data.datasets[2].data.push(imu2AccelZ); // Z-axis data

            // Limit data points
            if (imu2InterpolationChart.data.labels.length > maxDataPoints) {
                imu2InterpolationChart.data.labels.shift();
                imu2InterpolationChart.data.datasets.forEach(dataset => dataset.data.shift());
            }

            imu2InterpolationChart.update('none');
        }
    }, 100); // Update every 100ms
});
