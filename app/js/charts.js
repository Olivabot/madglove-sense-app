document.addEventListener('DOMContentLoaded', () => {
    // Create Gyroscope Doughnut Chart
    const gyroCtx = document.getElementById('imu2GyroChart').getContext('2d');
    const imu2GyroChart = new Chart(gyroCtx, {
        type: 'doughnut',
        data: {
            labels: ['Gyro X', 'Gyro Y', 'Gyro Z'], // Labels for X, Y, Z
            datasets: [{
                label: 'Gyroscope (°/s)',
                data: [0, 0, 0], // Initial data for X, Y, Z
                backgroundColor: ['#ff6384', '#36a2eb', '#4caf50'], // Colors for segments
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
                duration: 500, // Smooth animation duration
                easing: 'easeOutQuad'
            },
            cutout: '50%' // Inner radius for the doughnut effect
        }
    });

    // Real-time update for Gyroscope Data
    setInterval(() => {
        if (window.latestIMUData) {
            const imu2GyroX = window.latestIMUData[12];
            const imu2GyroY = window.latestIMUData[13];
            const imu2GyroZ = window.latestIMUData[14];

            // Update Doughnut Chart Data
            imu2GyroChart.data.datasets[0].data = [
                Math.abs(imu2GyroX), // Use absolute values for clarity
                Math.abs(imu2GyroY),
                Math.abs(imu2GyroZ)
            ];
            imu2GyroChart.update('none'); // Update chart without animation for real-time performance
        }
    }, 100); // Update every 100ms
});
