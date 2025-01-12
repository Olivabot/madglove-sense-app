document.addEventListener('DOMContentLoaded', () => {
    const statusElem = document.querySelector('#status');
    const debugElem = document.querySelector('#debug');
    const dataElem = document.querySelector('#data');
    const connectBtn = document.querySelector('#connect');
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');

    let device = null;
    let characteristic = null;
    const debugLog = []; // Array to hold debug messages
    const DEBUG_LOG_LIMIT = 10; // Limit debug log size

    connectBtn.addEventListener('click', async () => {
        statusElem.textContent = 'Scanning for devices...';
        debugElem.textContent = '';
        resetConnection();

        try {
            device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'] }]
            });

            device.addEventListener('gattserverdisconnected', onDisconnected);

            statusElem.textContent = 'Connecting...';

            const server = await device.gatt.connect();
            const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
            characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');

            statusElem.textContent = 'Connected! Ready to receive data';

            startBtn.disabled = false;
            stopBtn.disabled = false;

            // Handle notifications
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', event => {
                const rawData = new TextDecoder().decode(event.target.value);

                // Update the current data display
                const values = rawData.split(',');
                const timestamp = values[0];
                const temperature = values[1];
                const pressure = values[2];
                const imu1 = {
                    accel: { x: values[3], y: values[4], z: values[5] },
                    gyro: { x: values[6], y: values[7], z: values[8] }
                };
                const imu2 = {
                    accel: { x: values[9], y: values[10], z: values[11] },
                    gyro: { x: values[12], y: values[13], z: values[14] }
                };

                // Display the latest data
                dataElem.innerHTML = `
                    <b>Timestamp:</b> ${timestamp} ms<br>
                    <b>Temperature:</b> ${temperature} °C<br>
                    <b>Pressure:</b> ${pressure} hPa<br>
                    <b>IMU1 Accel:</b> X=${imu1.accel.x}, Y=${imu1.accel.y}, Z=${imu1.accel.z}<br>
                    <b>IMU1 Gyro:</b> X=${imu1.gyro.x}, Y=${imu1.gyro.y}, Z=${imu1.gyro.z}<br>
                    <b>IMU2 Accel:</b> X=${imu2.accel.x}, Y=${imu2.accel.y}, Z=${imu2.accel.z}<br>
                    <b>IMU2 Gyro:</b> X=${imu2.gyro.x}, Y=${imu2.gyro.y}, Z=${imu2.gyro.z}<br>
                `;

                // Update debug log
                debugLog.push(rawData); // Add the latest message
                if (debugLog.length > DEBUG_LOG_LIMIT) {
                    debugLog.shift(); // Remove the oldest message if over the limit
                }
                debugElem.textContent = debugLog.join('\n'); // Display the log
            });
        } catch (error) {
            console.error(error);
            statusElem.textContent = `Error: ${error.message}`;
            resetConnection();
        }
    });

    startBtn.addEventListener('click', () => {
        if (characteristic) {
            const command = new TextEncoder().encode('START');
            characteristic.writeValue(command).then(() => {
                statusElem.textContent = 'Streaming started...';
            });
        }
    });

    stopBtn.addEventListener('click', () => {
        if (characteristic) {
            const command = new TextEncoder().encode('STOP');
            characteristic.writeValue(command).then(() => {
                statusElem.textContent = 'Streaming stopped.';
            });
        }
    });

    function resetConnection() {
        if (device) {
            if (device.gatt.connected) {
                device.gatt.disconnect();
            }
            device = null;
        }
        characteristic = null;
        startBtn.disabled = true;
        stopBtn.disabled = true;
        statusElem.textContent = 'Disconnected.';
    }

    function onDisconnected() {
        statusElem.textContent = 'Device disconnected. Resetting...';
        resetConnection();
    }

    // --------------------------------------------
    // ---> Chart.js Initialization (Add here at the END inside DOMContentLoaded)
    // --------------------------------------------
    const ctx = document.getElementById('imu2AccelChart').getContext('2d');
    const imu2AccelChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Time labels
            datasets: [
                { label: 'Accel X', data: [], borderColor: 'red', fill: false },
                { label: 'Accel Y', data: [], borderColor: 'green', fill: false },
                { label: 'Accel Z', data: [], borderColor: 'blue', fill: false }
            ]
        },
        options: {
            animation: false,
            responsive: true,
            scales: {
                x: {
                    type: 'linear', // Time scale
                    title: { display: true, text: 'Time (ms)' }
                },
                y: {
                    title: { display: true, text: 'Acceleration (g)' },
                    suggestedMin: -2,
                    suggestedMax: 2
                }
            }
        }
    });

    // Chart Update Function
    function updateIMU2Chart(timestamp, accelX, accelY, accelZ) {
        const maxDataPoints = 100; // Rolling window size

        // Add new data
        imu2AccelChart.data.labels.push(timestamp);
        imu2AccelChart.data.datasets[0].data.push(accelX);
        imu2AccelChart.data.datasets[1].data.push(accelY);
        imu2AccelChart.data.datasets[2].data.push(accelZ);

        // Limit data points
        if (imu2AccelChart.data.labels.length > maxDataPoints) {
            imu2AccelChart.data.labels.shift();
            imu2AccelChart.data.datasets.forEach(dataset => dataset.data.shift());
        }

        imu2AccelChart.update('none'); // Update chart without animation
    }
    
});
