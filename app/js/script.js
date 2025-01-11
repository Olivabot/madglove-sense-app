document.querySelector('#connect').addEventListener('click', function () {
    const statusElem = document.querySelector('#status');
    const debugElem = document.querySelector('#debug');

    statusElem.textContent = 'Scanning for devices...';
    debugElem.textContent = '';

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
        debugElem.textContent += 'Characteristic found!\n';
        statusElem.textContent = 'Connected! Ready to control LED';

        // Start notifications
        return characteristic.startNotifications().then(() => {
            characteristic.addEventListener('characteristicvaluechanged', event => {
                const value = new TextDecoder().decode(event.target.value);
                debugElem.textContent += `Notification received: ${value}\n`;
            });
        });
    })
    .catch(error => {
        console.error(error);
        statusElem.textContent = `Error: ${error.message}`;
        debugElem.textContent += `Error: ${error.message}\n`;
    });
});
