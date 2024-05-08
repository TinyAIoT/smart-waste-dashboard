const now = new Date(Date.now()).toISOString()
const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString()
const forteenDaysAgo = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000)).toISOString()

const fetchBinData = async (boxId, sensorId, batteryId, boxName, dispatch, fromDate = forteenDaysAgo, toDate = now) => {
    let fuellstand =  { combined: undefined, name: "Füllstand", id: boxId }
    let battery =  { combined: undefined, name: "Batterieladung", id: boxId }
    if (sensorId) {
        try {
            const res = await fetch(`https://api.opensensemap.org/boxes/${boxId}/data/${sensorId}?from-date=${fromDate}&to-date=${toDate}&download=false&format=json`);
            const data = await res.json();
            console.log(data);
            const labels = []
            const combined = []
            const dataSet = []
            data.forEach(element => {
                combined.push({
                    "x": element.createdAt,
                    "y": parseFloat(element.value)
                })
                labels.push(element.createdAt)
                dataSet.push(parseFloat(element.value))
            });
            fuellstand = { combined: combined, name: "Füllstand", id: boxId };
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    if (batteryId) {
        try {
            const res = await fetch(`https://api.opensensemap.org/boxes/${boxId}/data/${batteryId}?from-date=${fromDate}&to-date=${toDate}&download=false&format=json`);
            const data = await res.json();
            console.log(data);
            const labels = []
            const combined = []
            const dataSet = []
            data.forEach(element => {
                combined.push({
                    "x": element.createdAt,
                    "y": parseFloat(element.value)
                })
                labels.push(element.createdAt)
                dataSet.push(parseFloat(element.value))
            });
            battery = { combined: combined, name: "Batterieladung", id: boxId };
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    console.log({ fuellstand: fuellstand, battery: battery });
    return [fuellstand, battery]
}

export default fetchBinData;
