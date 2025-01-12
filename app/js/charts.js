document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('imu2AccelChart').getContext('2d');

    // Create horizontal bar chart
    const imu2AccelChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Accel X', 'Accel Y', 'Accel Z'],
            datasets: [
                {
                    label: 'Acceleration (g)',
                    data: [0, 0, 0],
                    backgroundColor: ['#ff6384', '#36a2eb', '#4caf50'],
                    borderColor: ['#ff6384', '#36a2eb', '#4caf50'],
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Acceleration (g)'
                    },
                    min: -2,
                    max: 2
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
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'nearest',
                    callbacks: {
                        label: (context) => `Value: ${context.raw.toFixed(2)}`
                    }
                }
            },
            responsive: true,
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        }
    });

    // Real-time data update
    let previousData = [0, 0, 0]; // Initial data for X, Y, Z

    setInterval(() => {
        if (window.latestIMUData) {
            const imu2AccelX = window.latestIMUData[9];
            const imu2AccelY = window.latestIMUData[10];
            const imu2AccelZ = window.latestIMUData[11];

            // Interpolate values for smooth transitions
            previousData[0] += (imu2AccelX - previousData[0]) * 0.2;
            previousData[1] += (imu2AccelY - previousData[1]) * 0.2;
            previousData[2] += (imu2AccelZ - previousData[2]) * 0.2;

            // Update chart data
            imu2AccelChart.data.datasets[0].data = [...previousData];
            imu2AccelChart.update('active');
        }
    }, 100); // Update every 100ms
});
