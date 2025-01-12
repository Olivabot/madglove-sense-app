document.addEventListener('DOMContentLoaded', () => {
    const createDirectionalPieChart = (ctx, label) => {
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Gyro X (+)', 'Gyro X (-)', 'Gyro Y (+)', 'Gyro Y (-)', 'Gyro Z (+)', 'Gyro Z (-)'],
                datasets: [{
                    label: label,
                    data: [0, 0, 0, 0, 0, 0], // Initial values for positive/negative segments
                    backgroundColor: ['#ff6384', '#ff9f40', '#36a2eb', '#4bc0c0', '#4caf50', '#ffcd56'], // Positive/Negative colors
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.label}: ${context.raw.toFixed(2)} °/s`;
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

    // Create Pie Chart for IMU2 Gyroscope
    const gyroCtx = document.getElementById('imu2GyroChart').getContext('2d');
    const imu2GyroChart = createDirectionalPieChart(gyroCtx, 'IMU2 Gyroscope');

    // Real-time update for Gyroscope Data
    setInterval(() => {
        if (window.latestIMUData) {
            const imu2GyroX = window.latestIMUData[12]; // Gyroscope X
            const imu2GyroY = window.latestIMUData[13]; // Gyroscope Y
            const imu2GyroZ = window.latestIMUData[14]; // Gyroscope Z

            // Separate positive and negative values
            const data = [
                Math.max(imu2GyroX, 0), // Gyro X (+)
                Math.abs(Math.min(imu2GyroX, 0)), // Gyro X (-)
                Math.max(imu2GyroY, 0), // Gyro Y (+)
                Math.abs(Math.min(imu2GyroY, 0)), // Gyro Y (-)
                Math.max(imu2GyroZ, 0), // Gyro Z (+)
                Math.abs(Math.min(imu2GyroZ, 0))  // Gyro Z (-)
            ];

            // Update Pie Chart Data
            imu2GyroChart.data.datasets[0].data = data;
            imu2GyroChart.update('none');
        }
    }, 100); // Update every 100ms
});
