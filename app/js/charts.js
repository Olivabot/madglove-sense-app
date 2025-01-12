document.addEventListener('DOMContentLoaded', () => {
    const createBarChartWithBorderRadius = (ctx, label, yLabel) => {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['X (+/-)', 'Y (+/-)', 'Z (+/-)'], // Labels for axes
                datasets: [
                    {
                        label: `${label} (+)`,
                        data: [0, 0, 0], // Positive values for X, Y, Z
                        backgroundColor: ['#ff6384', '#36a2eb', '#4caf50'], // Positive colors
                        borderWidth: 2,
                        borderRadius: 10, // Rounded corners
                        borderSkipped: false
                    },
                    {
                        label: `${label} (-)`,
                        data: [0, 0, 0], // Negative values for X, Y, Z
                        backgroundColor: ['#ff9f40', '#4bc0c0', '#ffcd56'], // Negative colors
                        borderWidth: 2,
                        borderRadius: 10, // Rounded corners
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true, // Stacked bars for positive and negative
                        title: {
                            display: true,
                            text: 'Axes'
                        }
                    },
                    y: {
                        stacked: true, // Stacked bars
                        title: {
                            display: true,
                            text: yLabel
                        },
                        suggestedMin: -2, // Adjusted range for data
                        suggestedMax: 2
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)} ${yLabel}`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 500,
                    easing: 'easeOutQuad'
                }
            }
        });
    };

    // Initialize bar charts
    const imu2AccelBarCtx = document.getElementById('imu2AccelBarChart').getContext('2d');
    const imu2GyroBarCtx = document.getElementById('imu2GyroBarChart').getContext('2d');

    const imu2AccelBarChart = createBarChartWithBorderRadius(
        imu2AccelBarCtx,
        'Accelerometer',
        'Acceleration (g)'
    );
    const imu2GyroBarChart = createBarChartWithBorderRadius(
        imu2GyroBarCtx,
        'Gyroscope',
        'Rotation (°/s)'
    );

    // Real-time data update
    setInterval(() => {
        if (window.latestIMUData) {
            // Extract IMU2 accelerometer data
            const imu2AccelX = window.latestIMUData[9];
            const imu2AccelY = window.latestIMUData[10];
            const imu2AccelZ = window.latestIMUData[11];

            // Extract IMU2 gyroscope data
            const imu2GyroX = window.latestIMUData[12];
            const imu2GyroY = window.latestIMUData[13];
            const imu2GyroZ = window.latestIMUData[14];

            // Update accelerometer bar chart
            imu2AccelBarChart.data.datasets[0].data = [
                Math.max(imu2AccelX, 0),
                Math.max(imu2AccelY, 0),
                Math.max(imu2AccelZ, 0)
            ];
            imu2AccelBarChart.data.datasets[1].data = [
                Math.abs(Math.min(imu2AccelX, 0)),
                Math.abs(Math.min(imu2AccelY, 0)),
                Math.abs(Math.min(imu2AccelZ, 0))
            ];
            imu2AccelBarChart.update('none');

            // Update gyroscope bar chart
            imu2GyroBarChart.data.datasets[0].data = [
                Math.max(imu2GyroX, 0),
                Math.max(imu2GyroY, 0),
                Math.max(imu2GyroZ, 0)
            ];
            imu2GyroBarChart.data.datasets[1].data = [
                Math.abs(Math.min(imu2GyroX, 0)),
                Math.abs(Math.min(imu2GyroY, 0)),
                Math.abs(Math.min(imu2GyroZ, 0))
            ];
            imu2GyroBarChart.update('none');
        }
    }, 100); // Update every 100ms
});
