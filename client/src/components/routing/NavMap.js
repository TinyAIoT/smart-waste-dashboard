import React, { useEffect, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import { getBins } from '../../actions/bins';
import ReactMapGL, { Marker } from 'react-map-gl';
import Supercluster from 'supercluster';
import '../map/cluster.css';
import { Avatar, Paper, Tooltip } from '@mui/material';
import { featureCollection, feature, bbox } from '@turf/turf';

const supercluster = new Supercluster({
    radius: 75,
    maxZoom: 20,
});

const NavMap = () => {
    const {
        state: { filteredBins, selectedBins, route, currentUser },
        dispatch,
        routeMapRef,
    } = useValue();
    const [binPoints, setBinPoints] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [bounds, setBounds] = useState([-180, -85, 180, 85]);
    const [zoom, setZoom] = useState(0);
    const [nothing, setNothing] = useState(featureCollection([]));

    useEffect(() => {
        getBins(currentUser?.grouptag, dispatch);
    }, []);

    useEffect(() => {
        const binPoints = filteredBins.map((bin) => ({
            type: 'Feature',
            properties: bin,
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(bin.longitude), parseFloat(bin.latitude)],
            },
        }));
        setBinPoints(binPoints);
    }, [filteredBins]);

    useEffect(() => {
        supercluster.load(binPoints);
        const currentClusters = supercluster.getClusters(bounds, zoom);
        const extendedClusters = currentClusters.map((cl) => {
            const { cluster: isCluster, point_count } = cl.properties;
            const { id } = cl;
            let hasDataCount = point_count;
            if (isCluster) {
                const leaves = supercluster.getLeaves(id)
                let sum = 0;
                const names = [];

                leaves.forEach(leave => {
                    if (leave.properties.fuellstand) {
                        sum += parseFloat(leave.properties.fuellstand);
                    } else {
                        hasDataCount -= 1;
                    }
                    names.push(leave.properties.name);
                });
                const avg = sum / hasDataCount;
                cl.properties.avg = avg;
                cl.properties.leaveNames = names;
            }
            return cl
        })
        setClusters(extendedClusters);
    }, [binPoints, zoom, bounds]);

    useEffect(() => {
        if (routeMapRef.current) {
            setBounds(routeMapRef.current.getMap().getBounds().toArray().flat());
        }
    }, [routeMapRef]);

    useEffect(() => {
        if (binPoints.length > 0) {
            const geojson = {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'properties': {},
                            'coordinates': binPoints.map((bin) => {
                                return bin.geometry.coordinates
                            })
                        }
                    }
                ]
            }
            const [minLng, minLat, maxLng, maxLat] = bbox(geojson);
            routeMapRef?.current.fitBounds(
                [[minLng, minLat], [maxLng, maxLat]],
                { padding: 125, duration: 1500 });
        }
    }, [binPoints]);

    useEffect(() => {
        routeMapRef.current?.on("load", () => {
            if (routeMapRef.current && routeMapRef.current.getMap().getSource('route') === undefined) {

                routeMapRef.current.getMap().addSource('route', {
                    type: 'geojson',
                    data: nothing
                });

                // routeMapRef.current.getMap().addSource('stops', {
                //     type: 'geojson',
                //     data: nothing
                // });

                routeMapRef.current.getMap().addSource('start', {
                    type: 'geojson',
                    data: nothing
                });

                routeMapRef.current.getMap().addSource('end', {
                    type: 'geojson',
                    data: nothing
                });


                routeMapRef.current.getMap().addLayer(
                    {
                        id: 'routeline-active',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#3887be',
                            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12]
                        }
                    }
                );

                // routeMapRef.current.getMap().addLayer(
                //     {
                //         id: 'route-stops',
                //         source: 'stops',
                //         type: 'symbol',
                //         layout: {
                //             'icon-image': 'embassy-15',
                //             'icon-size': 1.5,
                //             'icon-allow-overlap': false
                //         },
                //         paint: {
                //             'text-color': '#3887be',
                //         }
                //     },
                // );
                routeMapRef.current.getMap().loadImage(
                    'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                    (error, image) => {
                        if (error) throw error;
                        routeMapRef.current.getMap().addImage('custom-marker', image, { sdf: true });
                        // Add starting point to the map
                        routeMapRef.current.getMap().addLayer({
                            id: 'start',
                            type: 'symbol',
                            source: 'start',
                            layout: {
                                'icon-image': 'custom-marker',
                                // get the title name from the source's "title" property
                                'text-field': ['get', 'title'],
                                'text-font': [
                                    'Open Sans Semibold',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-offset': [0, 1.25],
                                'text-anchor': 'top',
                                'icon-allow-overlap': true

                            },
                            paint: {
                                'icon-color': '#9ACD32',
                            }
                        });

                        // Add ending point to the map
                        routeMapRef.current.getMap().addLayer({
                            id: 'end',
                            type: 'symbol',
                            source: 'end',
                            paint: {
                                'icon-color': '#f30',
                            },
                            layout: {
                                'icon-image': 'custom-marker',
                                // get the title name from the source's "title" property
                                'text-field': ['get', 'title'],
                                'text-font': [
                                    'Open Sans Semibold',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-offset': [0, 1.25],
                                'text-anchor': 'top',
                                'icon-allow-overlap': true

                            }
                        });
                    });


                routeMapRef.current.getMap().addLayer(
                    {
                        id: 'routearrows',
                        type: 'symbol',
                        source: 'route',
                        layout: {
                            'symbol-placement': 'line',
                            'text-field': '▶',
                            'text-size': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                12,
                                24,
                                22,
                                60
                            ],
                            'symbol-spacing': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                12,
                                30,
                                22,
                                160
                            ],
                            'text-keep-upright': false
                        },
                        paint: {
                            'text-color': '#3887be',
                            'text-halo-color': 'hsl(55, 11%, 96%)',
                            'text-halo-width': 3
                        }
                    }
                );
            }
        })
    }, [routeMapRef.current]);

    useEffect(() => {
        if (route && routeMapRef.current) {
            const routeGeoJSON = featureCollection([
                feature(route.trips[0].geometry)
            ]);
            routeMapRef?.current.getMap().getSource('route').setData(routeGeoJSON);
            // routeMapRef?.current.getMap().getSource('stops').setData(pointsGeoJSON);
            routeMapRef?.current.getMap().getSource('start').setData(
                featureCollection([
                    feature({
                        type: "Point",
                        coordinates: [route.waypoints[0].location[0], route.waypoints[0].location[1]],
                        properties: {
                            title: 'Start'
                        }
                    })
                ])
            );
            routeMapRef?.current.getMap().getSource('end').setData(
                featureCollection([
                    feature({
                        type: "Point",
                        coordinates: [
                            route.waypoints[route.waypoints.length - 1].location[0],
                            route.waypoints[route.waypoints.length - 1].location[1]
                        ],
                        properties: {
                            title: 'Start'
                        }
                    })
                ])
            );
            const [minLng, minLat, maxLng, maxLat] = bbox(route.trips[0].geometry);
            routeMapRef?.current?.getMap().fitBounds(
                [[minLng, minLat], [maxLng, maxLat]],
                { padding: 100, duration: 1500 });

        }
    }, [route]);



    return (
        <ReactMapGL
            initialViewState={{ latitude: 52.055, longitude: 7.357, zoom: 8 }}
            mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            ref={routeMapRef}
            onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom))}
            style={{ position: 'absolute' }}
        >
            {clusters.map((cluster) => {
                const { cluster: isCluster, point_count } = cluster.properties;
                const [longitude, latitude] = cluster.geometry.coordinates;
                if (isCluster) {
                    return (
                        <Marker
                            key={`cluster-${cluster.id}`}
                            longitude={longitude}
                            latitude={latitude}
                        >
                            <div
                                className="cluster-marker"
                                style={{
                                    width: `${10 + (point_count / binPoints.length) * 20}px`,
                                    height: `${10 + (point_count / binPoints.length) * 20}px`,
                                    backgroundColor:
                                        cluster.properties.avg > 0 ||
                                            cluster.properties.avg < 100 ?
                                            `rgba(
                                                ${255 * Math.sqrt(Math.sin(cluster.properties.avg * Math.PI / 200))},
                                                ${255 * Math.sqrt(Math.cos(cluster.properties.avg * Math.PI / 200))}
                                                , 0, 0.7)`
                                            : 'white',
                                    outlineStyle: (cluster.properties.leaveNames.some(ln => selectedBins.some(sb => ln === sb.name))) ? 'auto' : 'none',
                                    outlineColor: '#0066CC'
                                }}
                                onClick={() => {
                                    const zoom = Math.min(
                                        supercluster.getClusterExpansionZoom(cluster.id),
                                        20
                                    );
                                    routeMapRef.current.flyTo({
                                        center: [longitude, latitude],
                                        zoom,
                                        speed: 1.5,
                                    });
                                }}
                            >
                                {point_count}
                            </div>
                        </Marker>
                    );
                }

                return (
                    <Marker
                        key={`bin-${cluster.properties.name}`}
                        longitude={longitude}
                        latitude={latitude}
                    >
                        <Tooltip title={cluster.properties.name}>
                            <Avatar
                                src="../../bin.png"
                                component={Paper}
                                elevation={2}
                                style={{
                                    backgroundColor:
                                        cluster.properties.fuellstand > 0 ||
                                            cluster.properties.fuellstand < 100 ?
                                            `rgba(
                        ${255 * Math.sqrt(Math.sin(cluster.properties.fuellstand * Math.PI / 200))},
                        ${255 * Math.sqrt(Math.cos(cluster.properties.fuellstand * Math.PI / 200))}
                      , 0)`
                                            : 'white',
                                    outlineStyle: (selectedBins.some(e => e.name === cluster.properties.name)) ? 'auto' : 'none',
                                    outlineColor: '#0066CC'
                                }}
                            />
                        </Tooltip>
                    </Marker>
                );
            })}

            {/* {selectedBins.map((sBin) => {
                if ((clusters.some(e => e.properties != sBin.name))) {
                    return (
                        <Marker
                            key={`bin-${sBin.id}`}
                            longitude={sBin.longitude}
                            latitude={sBin.latitude}
                        >
                            <Tooltip title={sBin.name}>
                                <Avatar
                                    src="../../bin.png"
                                    component={Paper}
                                    elevation={2}
                                    style={{
                                        backgroundColor:
                                            sBin.fuellstand > 0 ||
                                                sBin.fuellstand < 100 ?
                                                `rgba(
                        ${255 * Math.sqrt(Math.sin(sBin.fuellstand * Math.PI / 200))},
                        ${255 * Math.sqrt(Math.cos(sBin.fuellstand * Math.PI / 200))}
                      , 0, 0.7)`
                                                : 'white',
                                        outlineStyle: 'auto',
                                        outlineColor: '#0066CC'
                                    }}
                                />
                            </Tooltip>
                        </Marker>
                    );
                }
            })} */}
        </ReactMapGL>
    );
};

export default NavMap;
