import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useEffect, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import { getBins, resetBinData } from '../../actions/bins';
import * as React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, CardActions, CardHeader } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import BatteryIcon from '../utils/batteryIcons';

const BinsRoutingList = () => {
    const {
        state: { filteredBins, selectedBins, section, currentUser },
        dispatch,
        routeMapRef,
    } = useValue();

    useEffect(() => {
        if (section === 4 || section === 2) {
            getBins(currentUser?.grouptag, dispatch);
        }
    }, []);

    function handleClick(e, bin, coords) {
        console.log(selectedBins);
        if (selectedBins.some(e => e.id === bin.id)) {
            console.log("Already selected - will delete now");
            dispatch({ type: 'DELETE_FROM_SELECTED_BINS', payload: bin });
        } else {
            console.log("Selection successful");
            dispatch({ type: 'UPDATE_SELECTED_BINS', payload: [bin] })
        }
        routeMapRef.current?.flyTo({
            center: coords,
            zoom: 12,
            speed: 1.5,
        });
    }

    dayjs.locale('de');

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {filteredBins.map((link) => {
                return (
                    <Box key={link.id}>
                        <Card sx={{ maxWidth: 350, mb: 0.5, mt: 0.5 }}
                            style={{ backgroundColor: (selectedBins.some(e => e.id === link.id)) ? '#dcedc8' : 'white' }}
                            onClick={(e) => {
                                e.preventDefault()
                                handleClick(e, link, [link.longitude, link.latitude])
                            }}>
                            <CardHeader
                                avatar={
                                    <Avatar
                                        src='smart-trash-logo.png'
                                        sx={{ width: 24, height: 24 }}
                                        aria-label="smart waste bin" />
                                }
                                titleTypographyProps={{ variant: 'subtitle2' }}
                                title={link.name}
                            />
                            <CardContent>
                                <Typography variant="subtitle2" component="div">
                                    Füllstand: {link.fuellstand} %
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {dayjs(link.time).format("DD.MM.YYYY - HH:mm:ss")} Uhr
                                </Typography>
                            </CardContent>
                            <Divider variant="middle" component="li" />
                            <Box sx={{ display: 'flex' }}>
                                <CardActions sx={{
                                    display: 'flex',
                                    flex: '1',
                                    p: '0 16',

                                }}>
                                    <BatteryIcon akkustand={link?.akkustand} />
                                </CardActions>
                            </Box>
                        </Card>
                        <Divider variant="middle" />
                    </Box>
                )
            })}
        </List>
    );
}
export default BinsRoutingList;