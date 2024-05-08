import { useValue } from '../../context/ContextProvider';
import { useEffect } from "react";
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    Tooltip,
    PointElement,
    LineElement,
    Title,
    Legend,
    LinearScale,
    TimeScale
} from "chart.js";
import 'chartjs-adapter-moment';
import zoomPlugin from "chartjs-plugin-zoom";

import { Line } from "react-chartjs-2";
import { getBinDataAll } from '../../actions/bins';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    zoomPlugin
);

const BinChartMulti = () => {
    const {
        state: { filteredBins, binDataAll, currentUser },
        dispatch,
    } = useValue();


    useEffect(() => {
        console.log("CHange in user");
        if (filteredBins) {
            console.log("FilteredBins defined.");
            console.log(filteredBins);
            getBinDataAll(filteredBins, dispatch);
        }
    }, [filteredBins, currentUser]);

    function stringToColor(string) {
        let hash = 0;
        let i;
        console.log(string);
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    return (
        <>
            <Line
                data={{
                    // labels: measurementLabels,
                    datasets:
                        binDataAll.combined?.length > 0 ? binDataAll.combined.map((dataArr, index) => {
                            console.log(binDataAll);
                            return ({
                                label: binDataAll.names[index],
                                data: dataArr,
                                backgroundColor: stringToColor(binDataAll.ids[index]),
                            })
                        })
                            :
                            [],
                }}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Füllstands Daten (7 Tage)'
                        },
                        legend: {
                            position: "top",
                        },
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: true // SET SCROOL ZOOM TO TRUE
                                },
                                mode: "x",
                                speed: 100,
                            },
                            pan: {
                                enabled: true,
                                mode: "x",
                                speed: 100
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day', // or any other time unit you need
                            },
                        },
                        y: {
                            min: 0,
                            max: 100,
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function (value, index, ticks) {
                                    return value + '%';
                                }
                            }

                        }
                    }
                }
                }
            />
        </>
    );
}

export default BinChartMulti;