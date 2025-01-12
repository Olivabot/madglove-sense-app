document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element for the chart
    const ctx = document.getElementById('imu2AccelChart').getContext('2d');

    // Create the horizontal bar chart
    const imu2AccelChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Accel X', 'Accel Y', 'Accel Z'], // Labels for X, Y, Z axes
            datasets: [
                {
                    label: 'Acceleration (g)',
                    data: [0, 0, 0], // Initial values for X, Y, Z
                    backgroundColor: ['#ff6384', '#36a2eb', '#4caf50'], // Colors for X, Y, Z
                    borderColor: ['#ff6384', '#36a2eb', '#4caf50'], // Border colors
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y', // Makes it horizontal
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Acceleration (g)'
                    },
                    min: -2,
                    max: 2 // Range for acceleration values
                },
                y: {
                    title: {
                        display: true,
                        text: 'Axes'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // No legend needed
                }
            },
            responsive: true,
            animation: {
                duration: 500 // Smooth animation for updates
            }
        }
    });

    // Update the chart with real-time data from IMU2
    setInterval(() => {
        if (window.latestIMUData) {
            // Extract IMU2 accelerometer data
            const [
                timestamp,
                temperature,
                pressure,
                imu1AccelX, imu1AccelY, imu1AccelZ, // IMU1 accelerometer
                imu1GyroX, imu1GyroY, imu1GyroZ,   // IMU1 gyroscope
                imu2AccelX, imu2AccelY, imu2AccelZ, // IMU2 accelerometer
                imu2GyroX, imu2GyroY, imu2GyroZ    // IMU2 gyroscope
            ] = window.latestIMUData;

            // Update chart data
            imu2AccelChart.data.datasets[0].data = [
                imu2AccelX, // X-axis
                imu2AccelY, // Y-axis
                imu2AccelZ  // Z-axis
            ];

            imu2AccelChart.update('none'); // Update without animation for smoother real-time updates
        }
    }, 50); // Update every 50ms
});
