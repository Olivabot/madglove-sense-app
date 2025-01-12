document.addEventListener('DOMContentLoaded', () => {
    const createChart = (ctx, label) => {
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
                    duration: 500, // Faster animation
                    easing: 'easeOutQuad'
                },
                plugins: {
                    legend: { display: false } // No legend
                }
            }
        });
    };

    // Create IMU1 and IMU2 charts
    const imu1AccelChart = createChart(document.getElementById('imu1AccelChart').getContext('2d'), 'IMU1 Acceleration');
    const imu2AccelChart = createChart(document.getElementById('imu2AccelChart').getContext('2d'), 'IMU2 Acceleration');

    // Real-time data update for both charts
    setInterval(() => {
        if (window.latestIMUData) {
            // Extract IMU1 and IMU2 accelerometer data
            const imu1AccelX = window.latestIMUData[3];
            const imu1AccelY = window.latestIMUData[4];
            const imu1AccelZ = window.latestIMUData[5];

            const imu2AccelX = window.latestIMUData[9];
            const imu2AccelY = window.latestIMUData[10];
            const imu2AccelZ = window.latestIMUData[11];

            // Update IMU1 Chart
            imu1AccelChart.data.datasets[0].data = [imu1AccelX, imu1AccelY, imu1AccelZ];
            imu1AccelChart.update('none');

            // Update IMU2 Chart
            imu2AccelChart.data.datasets[0].data = [imu2AccelX, imu2AccelY, imu2AccelZ];
            imu2AccelChart.update('none');
        }
    }, 100); // Update every 100ms
});
