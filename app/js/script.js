document.querySelector('#connect').addEventListener('click', function () {
    navigator.bluetooth
        .requestDevice({
            filters: [{ services: ['19b10000-e8f2-537e-4f6c-d104768a1214'] }]
        })
        .then(device => {
            device.addEventListener('gattserverdisconnected', () => {
                document.querySelector('#status').textContent = 'Disconnected';
                document.querySelector('#sensorData').textContent = '';
            });
            return device.gatt.connect();
        })
        .then(server => server.getPrimaryService('19b10000-e8f2-537e-4f6c-d104768a1214'))
        .then(service => service.getCharacteristic('19b10002-e8f2-537e-4f6c-d104768a1214'))
        .then(characteristic => {
            document.querySelector('#status').textContent = 'Connected';
            return characteristic.startNotifications().then(() => {
                characteristic.addEventListener('characteristicvaluechanged', event => {
                    const value = new TextDecoder().decode(event.target.value);
                    document.querySelector('#sensorData').textContent = value;
                });
            });
        })
        .catch(error => {
            console.error(error);
            document.querySelector('#status').textContent = 'Error connecting to BLE device';
        });
});
