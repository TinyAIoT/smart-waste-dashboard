const now = new Date(Date.now()).toISOString()
const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString()

const fetchBinDataAll = async (bins, dispatch, fromDate = sevenDaysAgo, toDate = now) => {
    console.log(bins);
    const combinedData = [];
    const nameData = [];
    const idData = [];
    for (let i = 0; i < bins.length; i++) {
        const element = bins[i]
        const boxId = element.id;
        const sensorId = element.sensorId;
        const name = element.name;
        idData.push(boxId)
        nameData.push(name);
        if (sensorId) {
            try {
                const res = await fetch(`https://api.opensensemap.org/boxes/${boxId}/data/${sensorId}?from-date=${fromDate}&to-date=${toDate}&download=false&format=json`);
                const data = await res.json();
                console.log(data);
                const combined = []
                data.forEach(element => {
                    combined.push({
                        "x": element.createdAt,
                        "y": parseFloat(element.value)
                    })
                });
                combinedData.push(combined);
            } catch (err) {
                console.log(err);
            }
        } else {
            combinedData.push([]);
        }
    }
    console.log({ combined: combinedData, names: nameData, ids: idData });
    return { combined: combinedData, names: nameData, ids: idData };
}

export default fetchBinDataAll;
