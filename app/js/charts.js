document.addEventListener('DOMContentLoaded', () => {
    // Create chart options with adjusted scale
    const chartOptions = {
        type: 'bar',
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Acceleration (g)'
                    },
                    min: -1.1, // Adjusted minimum
                    max: 1.1  // Adjusted maximum
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
    };

    // Initialize IMU1 Accelerometer Chart
    const imu1AccelCtx = document.getElementById('imu1AccelChart').getContext('2d');
    const imu1AccelChart = new Chart(imu1AccelCtx, {
        ...chartOptions,
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
        }
    });

    // Initialize IMU2 Accelerometer Chart
    const imu2AccelCtx = document.getElementById('imu2AccelChart').getContext('2d');
    const imu2AccelChart = new Chart(imu2AccelCtx, {
        ...chartOptions,
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
        }
    });

    // Real-time data update for both charts
    let imu1PreviousData = [0, 0, 0]; // Initial data for IMU1
    let imu2PreviousData = [0, 0, 0]; // Initial data for IMU2

    setInterval(() => {
        if (window.latestIMUData) {
            const imu1AccelX = window.latestIMUData[3];
            const imu1AccelY = window.latestIMUData[4];
            const imu1AccelZ = window.latestIMUData[5];

            const imu2AccelX = window.latestIMUData[9];
            const imu2AccelY = window.latestIMUData[10];
            const imu2AccelZ = window.latestIMUData[11];

            // Interpolate for IMU1
            imu1PreviousData[0] += (imu1AccelX - imu1PreviousData[0]) * 0.2;
            imu1PreviousData[1] += (imu1AccelY - imu1PreviousData[1]) * 0.2;
            imu1PreviousData[2] += (imu1AccelZ - imu1PreviousData[2]) * 0.2;

            // Update IMU1 Chart
            imu1AccelChart.data.datasets[0].data = [...imu1PreviousData];
            imu1AccelChart.update('none');

            // Interpolate for IMU2
            imu2PreviousData[0] += (imu2AccelX - imu2PreviousData[0]) * 0.2;
            imu2PreviousData[1] += (imu2AccelY - imu2PreviousData[1]) * 0.2;
            imu2PreviousData[2] += (imu2AccelZ - imu2PreviousData[2]) * 0.2;

            // Update IMU2 Chart
            imu2AccelChart.data.datasets[0].data = [...imu2PreviousData];
            imu2AccelChart.update('none');
        }
    }, 100); // Update every 100ms
});
