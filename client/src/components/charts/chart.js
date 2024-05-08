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
    TimeScale,
    TimeSeriesScale
} from "chart.js";
import 'chartjs-adapter-moment';
import zoomPlugin from "chartjs-plugin-zoom";

import { Line } from "react-chartjs-2";
import { getBinData } from '../../actions/bins';
import ChartLoading from '../ChartLoading';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TimeSeriesScale,
    zoomPlugin
);

const BinChart = () => {
    const {
        state: { binData, selectedBin },
        dispatch,
    } = useValue();


    useEffect(() => {
        if (selectedBin) {
            console.log("change in value");
            console.log(selectedBin);
            getBinData(selectedBin.id, selectedBin.sensorId, selectedBin.batteryId, selectedBin.name, dispatch);
        }
    }, [selectedBin]);

    return (
        <>
            <ChartLoading />
            <Line
                data={{
                    datasets:
                        binData?.length > 0 ? binData.map((sensorData, index) => {
                            console.log(sensorData);
                            return ({
                                label: sensorData?.name,
                                data: sensorData?.combined,
                                backgroundColor: index === 0 ? '#9F70FD' : '#FF8911',
                            })
                        })
                            : []
                }}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: selectedBin?.name + ' (Daten der letzten 7 Tage)'
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
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 50,
                                maxRotation: 0,
                                major: {
                                    enabled: true
                                }
                            },
                            time: {
                                displayFormats: {
                                    hour: 'HH:mm',
                                    minute: 'HH:mm',
                                    second: 'HH:mm:ss'
                                }
                            }
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

export default BinChart;