document.addEventListener('DOMContentLoaded', () => {
    const createBarChart = (ctx, label) => {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Accel X', 'Accel Y', 'Accel Z'], // Bar labels
                datasets: [{
                    label: label,
                    data: [0, 0, 0], // Initial data for X, Y, Z
                    backgroundColor: ['#ff6384', '#36a2eb', '#4caf50'], // Colors for bars
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal bars
                scales: {
                    x: {
                        min: -1.1, // Minimum value
                        max: 1.1, // Maximum value
                        title: {
                            display: true,
                            text: 'Acceleration (g)'
                        }
                    }
                },
                responsive: true,
                animation: {
                    duration: 500, // Smooth animation
                    easing: 'easeOutQuad'
                },
                plugins: {
                    legend: { display: false } // No legend
                }
            }
        });
    };

    const createDoughnutChart = (ctx, label) => {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Gyro X', 'Gyro Y', 'Gyro Z'], // Labels for X, Y, Z
                datasets: [{
                    label: label,
                    data: [0, 0, 0], // Initial data
                    backgroundColor: ['#ff6384', '#36a2eb', '#4caf50'], // Segment colors
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top' // Legend position
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Value: ${context.raw.toFixed(2)} °/s`
                        }
                    }
                },
                animation: {
                    duration: 500, // Smooth animation
                    easing: 'easeOutQuad'
                },
                cutout: '50%' // Inner cutout for doughnut effect
            }
        });
    };

    // Initialize charts
    const imu1AccelChart = createBarChart(document.getElementById('imu1AccelChart').getContext('2d'), 'IMU1 Acceleration');
    const imu2AccelChart = createBarChart(document.getElementById('imu2AccelChart').getContext('2d'), 'IMU2 Acceleration');
    const imu2GyroChart = createDoughnutChart(document.getElementById('imu2GyroChart').getContext('2d'), 'IMU2 Gyroscope');

    // Real-time data update for all charts
    setInterval(() => {
        if (window.latestIMUData) {
            // Extract IMU1 and IMU2 accelerometer data
            const imu1AccelX = window.latestIMUData[3];
            const imu1AccelY = window.latestIMUData[4];
            const imu1AccelZ = window.latestIMUData[5];

            const imu2AccelX = window.latestIMUData[9];
            const imu2AccelY = window.latestIMUData[10];
            const imu2AccelZ = window.latestIMUData[11];

            const imu2GyroX = window.latestIMUData[12];
            const imu2GyroY = window.latestIMUData[13];
            const imu2GyroZ = window.latestIMUData[14];

            // Update IMU1 Accelerometer Chart
            imu1AccelChart.data.datasets[0].data = [imu1AccelX, imu1AccelY, imu1AccelZ];
            imu1AccelChart.update('none');

            // Update IMU2 Accelerometer Chart
            imu2AccelChart.data.datasets[0].data = [imu2AccelX, imu2AccelY, imu2AccelZ];
            imu2AccelChart.update('none');

            // Update IMU2 Gyroscope Doughnut Chart
            imu2GyroChart.data.datasets[0].data = [
                Math.abs(imu2GyroX), // Absolute value for clarity
                Math.abs(imu2GyroY),
                Math.abs(imu2GyroZ)
            ];
            imu2GyroChart.update('none');
        }
    }, 100); // Update every 100ms
});
