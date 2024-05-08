// const fetchData = async (
//     { url, method = 'POST', token = '', body = null },
//     dispatch
// ) => {
//     const headers = token
//         ? { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }
//         : { 'Content-Type': 'application/json' };
//     body = body ? { body: JSON.stringify(body) } : {};
//     try {
//         const response = await fetch(url, { method, headers, ...body });
//         const data = await response.json();
//         if (!data.success) {
//             if (response.status === 401)
//                 dispatch({ type: 'UPDATE_USER', payload: null });
//             throw new Error(data.message);
//         }
//         return data.result;
//     } catch (error) {
//         dispatch({
//             type: 'UPDATE_ALERT',
//             payload: { open: true, severity: 'error', message: error.message },
//         });
//         console.log(error);
//         return null;
//     }
// };

// export default fetchData;

const fetchRoute = async (dispatch, coordinates, start, end) => {
    const headers = { 'Content-Type': 'application/json' };
    const locations = [{
        "name": "start",
        "coordinates": start,
    }, {
        "name": "end",
        "coordinates": end,
    }]
    const services = []
    coordinates.forEach((element, index) => {
        locations.push({
            "name": element.name,
            "coordinates": element.coords,
        })
        services.push(
            {
                "name": "work-order-" + index,
                "location": element.name,
                // "duration": 300,
                // "requirements": [
                //     "ladder"
                // ],
                // "service_times": [
                //     {
                //         "earliest": "2022-05-31T13:00:00Z",
                //         "latest": "2022-05-31T14:00:00Z",
                //         "type": "soft"
                //     }
                // ]
            }
        )
    });
    const body = {
        "version": 1,
        "locations": locations,
        "vehicles": [
            {
                "name": "truck-1",
                "routing_profile": "mapbox/driving",
                "start_location": "start",
                "end_location": "end",
                // "capacities": {
                //     "volume": 3000,
                //     "weight": 1000,
                //     "boxes": 100
                // },
                // "capabilities": [
                //     "ladder",
                //     "refrigeration"
                // ],
                // "earliest_start": "2022-05-31T09:00:00Z",
                // "latest_end": "2022-05-31T17:00:00Z",
                // "breaks": [
                //     {
                //         "earliest_start": "2022-05-31T12:00:00Z",
                //         "latest_end": "2022-05-31T13:00:00Z",
                //         "duration": 1800
                //     }
                // ]
            }
        ],
        "services": services
    }

    try {
        const method = 'POST'
        const url = `https://api.mapbox.com/optimized-trips/v2?access_token=${process.env.REACT_APP_MAP_TOKEN}`;
        const response = await fetch(url, { method, headers, ...body });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }
        return data.result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default fetchRoute;
