const fetchBins = async (grouptag) => {

    try {
        const response = await fetch(`https://api.opensensemap.org/boxes?grouptag=${grouptag}`);
        const data = await response.json();
        const boxes = []
        for (let i = 0; i < data.length; i++) {
            const box = data[i]
            let sensor = box.sensors.find((el) => el.title === "Füllstand");
            let battery = box.sensors.find((el) => el.title === "Akkustand");
            if (sensor) {
                try {
                    const sensorResult = await fetch(`https://api.opensensemap.org/boxes/${box._id}/sensors/${sensor._id}`);
                    const sensorData = await sensorResult.json();
                    box.lastFuellstand = sensorData.lastMeasurement?.value
                    box.lastFuellstandAt = sensorData.lastMeasurement?.createdAt
                }
                catch (err) {
                    console.log(err);
                }
            }
            if (battery) {

                try {
                    const sensorResult = await fetch(`https://api.opensensemap.org/boxes/${box._id}/sensors/${battery._id}`);
                    const sensorData = await sensorResult.json();
                    box.lastBattery = sensorData.lastMeasurement?.value
                    box.lastBatteryAt = sensorData.lastMeasurement?.createdAt
                }
                catch (err) {
                    console.log(err);
                }
            }
            const fullData = {
                name: box.name,
                fuellstand: box.lastFuellstand,
                akkustand: box.lastBattery,
                time: box.lastFuellstandAt,
                akkuTime: box.lastBatteryAt,
                latitude: box.currentLocation.coordinates[1],
                longitude: box.currentLocation.coordinates[0],
                id: box._id,
                sensorId: sensor?._id,
                batteryId: battery?._id
            }
            boxes.push(fullData)
        };
        return boxes;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default fetchBins;
