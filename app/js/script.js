document.querySelector('#connect').addEventListener('click', function () {
    const statusElem = document.querySelector('#status');
    const debugElem = document.querySelector('#debug');
    const dataElem = document.querySelector('#data');

    statusElem.textContent = 'Scanning for devices...';
    debugElem.textContent = '';
    let characteristic;

    navigator.bluetooth.requestDevice({
        filters: [{ services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'] }]
    })
    .then(device => {
        debugElem.textContent += `Found device: ${device.name}\n`;
        statusElem.textContent = 'Connecting...';

        device.addEventListener('gattserverdisconnected', () => {
            statusElem.textContent = 'Disconnected';
            debugElem.textContent += 'Device disconnected\n';
        });

        return device.gatt.connect();
    })
    .then(server => server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b'))
    .then(service => service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8'))
    .then(char => {
        characteristic = char;
        debugElem.textContent += 'Characteristic found!\n';
        statusElem.textContent = 'Connected! Ready to receive data';

        // Start notifications
        return characteristic.startNotifications().then(() => {
            characteristic.addEventListener('characteristicvaluechanged', event => {
                const rawData = new TextDecoder().decode(event.target.value);
                debugElem.textContent += `Data received: ${rawData}\n`;

                // Parse data
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

                // Display parsed data
                dataElem.innerHTML = `
                    <b>Timestamp:</b> ${timestamp} ms<br>
                    <b>Temperature:</b> ${temperature} °C<br>
                    <b>Pressure:</b> ${pressure} hPa<br>
                    <b>IMU1 Accel:</b> X=${imu1.accel.x}, Y=${imu1.accel.y}, Z=${imu1.accel.z}<br>
                    <b>IMU1 Gyro:</b> X=${imu1.gyro.x}, Y=${imu1.gyro.y}, Z=${imu1.gyro.z}<br>
                    <b>IMU2 Accel:</b> X=${imu2.accel.x}, Y=${imu2.accel.y}, Z=${imu2.accel.z}<br>
                    <b>IMU2 Gyro:</b> X=${imu2.gyro.x}, Y=${imu2.gyro.y}, Z=${imu2.gyro.z}<br>
                `;
            });
        });
    })
    .catch(error => {
        console.error(error);
        statusElem.textContent = `Error: ${error.message}`;
        debugElem.textContent += `Error: ${error.message}\n`;
    });

    document.querySelector('#start').addEventListener('click', () => {
        if (characteristic) {
            const command = new TextEncoder().encode('START');
            characteristic.writeValue(command).then(() => {
                debugElem.textContent += 'Sent: START\n';
            });
        }
    });

    document.querySelector('#stop').addEventListener('click', () => {
        if (characteristic) {
            const command = new TextEncoder().encode('STOP');
            characteristic.writeValue(command).then(() => {
                debugElem.textContent += 'Sent: STOP\n';
            });
        }
    });
});
