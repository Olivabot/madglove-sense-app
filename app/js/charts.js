document.addEventListener('DOMContentLoaded', () => {
    const createPieChart = (ctx, label) => {
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Gyro X', 'Gyro Y', 'Gyro Z'], // Labels for X, Y, Z axes
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
                        labels: {
                            generateLabels: function (chart) {
                                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                                const labelsOriginal = original.call(this, chart);

                                // Modify the color and hidden state of each label
                                labelsOriginal.forEach(label => {
                                    label.fillStyle = chart.data.datasets[0].backgroundColor[label.index];
                                    label.hidden = !chart.isDatasetVisible(0);
                                });

                                return labelsOriginal;
                            }
                        },
                        onClick: function (mouseEvent, legendItem, legend) {
                            const meta = legend.chart.getDatasetMeta(0);
                            meta.data[legendItem.index].hidden = !meta.data[legendItem.index].hidden;
                            legend.chart.update();
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                const index = context[0].dataIndex;
                                return `${context[0].label}: ${context[0].raw.toFixed(2)} °/s`;
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
    const imu2GyroChart = createPieChart(gyroCtx, 'IMU2 Gyroscope');

    // Real-time update for Gyroscope Data
    setInterval(() => {
        if (window.latestIMUData) {
            const imu2GyroX = Math.abs(window.latestIMUData[12]); // Gyroscope X (absolute value)
            const imu2GyroY = Math.abs(window.latestIMUData[13]); // Gyroscope Y (absolute value)
            const imu2GyroZ = Math.abs(window.latestIMUData[14]); // Gyroscope Z (absolute value)

            // Normalize data (optional, if values are highly variable)
            const maxGyro = Math.max(imu2GyroX, imu2GyroY, imu2GyroZ, 1); // Avoid division by zero
            const normalizedGyroX = (imu2GyroX / maxGyro) * 100;
            const normalizedGyroY = (imu2GyroY / maxGyro) * 100;
            const normalizedGyroZ = (imu2GyroZ / maxGyro) * 100;

            // Update Pie Chart Data
            imu2GyroChart.data.datasets[0].data = [
                normalizedGyroX,
                normalizedGyroY,
                normalizedGyroZ
            ];
            imu2GyroChart.update('none');
        }
    }, 100); // Update every 100ms
});
