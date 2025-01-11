document.querySelector('#connect').addEventListener('click', function () {
    // Display the current status
    document.querySelector('#status').textContent = 'Scanning for devices...';
    console.log('Scanning for BLE devices...');

    // Start the Bluetooth scan
    navigator.bluetooth
        .requestDevice({
            acceptAllDevices: true, // Allow all devices for broader testing
            optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'] // Add the target service UUID here
        })
        .then(device => {
            // Log the device and update the status
            console.log('Found device:', device);
            document.querySelector('#status').textContent = `Found device: ${device.name}`;
            
            // Add disconnect event listener
            device.addEventListener('gattserverdisconnected', () => {
                console.warn('Device disconnected');
                document.querySelector('#status').textContent = 'Disconnected';
                document.querySelector('#sensorData').textContent = '';
            });

            // Connect to the device
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Connected to GATT server:', server);
            document.querySelector('#status').textContent = 'Connected to device';
            
            // Get the primary service
            return server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b'); // Replace with your service UUID
        })
        .then(service => {
            console.log('Service found:', service);
            document.querySelector('#status').textContent = 'Service found';

            // Get the characteristic
            return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8'); // Replace with your characteristic UUID
        })
        .then(characteristic => {
            console.log('Characteristic found:', characteristic);
            document.querySelector('#status').textContent = 'Characteristic found';

            // Start notifications for the characteristic
            return characteristic.startNotifications().then(() => {
                console.log('Notifications started');
                document.querySelector('#status').textContent = 'Receiving notifications';

                // Handle value changes
                characteristic.addEventListener('characteristicvaluechanged', event => {
                    const value = new TextDecoder().decode(event.target.value);
                    console.log('Received data:', value);
                    document.querySelector('#sensorData').textContent = value;
                });
            });
        })
        .catch(error => {
            // Handle errors and display in the UI
            console.error('Error:', error);
            document.querySelector('#status').textContent = `Error: ${error.message}`;
        });
});
