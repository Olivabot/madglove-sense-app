document.querySelector('#connect').addEventListener('click', function () {
    const statusElem = document.querySelector('#status');
    const debugElem = document.querySelector('#debug');

    statusElem.textContent = 'Scanning for devices...';
    debugElem.textContent = ''; // Clear debug logs

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
    .then(characteristic => {
        statusElem.textContent = 'Connected! Ready to control LED';
        debugElem.textContent += 'Characteristic found!\n';

        // Bind ON and OFF buttons
        document.querySelector('#ledOn').addEventListener('click', () => {
            characteristic.writeValue(new TextEncoder().encode('ON'));
            debugElem.textContent += 'Sent: ON\n';
        });

        document.querySelector('#ledOff').addEventListener('click', () => {
            characteristic.writeValue(new TextEncoder().encode('OFF'));
            debugElem.textContent += 'Sent: OFF\n';
        });
    })
    .catch(error => {
        console.error(error);
        statusElem.textContent = 'Error connecting to BLE device';
        debugElem.textContent += `Error: ${error.message}\n`;
    });
});
