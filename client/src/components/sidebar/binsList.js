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
import { Box, CardActions, CardHeader, IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import BatteryIcon from '../utils/batteryIcons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '@mui/icons-material';
import { fontSize } from '@mui/system';

const BinsList = () => {
    const {
        state: { filteredBins, selectedBin, bin },
        dispatch,
        mapRef,
    } = useValue();
    const [binPoints, setBinPoints] = useState([]);

    function handleClick(e, bin, coords) {
        if (bin != selectedBin) {
            dispatch({ type: 'UPDATE_SELECTED_BIN', payload: bin })
        } else {
            dispatch({ type: 'UPDATE_SELECTED_BIN', payload: null })
        }
        mapRef.current?.flyTo({
            center: coords,
            zoom: mapRef.current.getZoom(),
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
                            style={{ backgroundColor: selectedBin?.name === link.name ? '#dcedc8' : 'white' }}
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
                                // action={
                                //     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                //         <IconButton
                                //             aria-label="info"
                                //             onClick={() => dispatch({ type: 'UPDATE_BIN', payload: link })}>
                                //             <InfoIcon />
                                //         </IconButton>
                                //         <BatteryIcon akkustand={link?.akkustand} />
                                //     </Box>
                                // }
                                titleTypographyProps={{ variant: 'subtitle2' }}
                                title={link.name}
                            />

                            <CardContent>
                                <Typography variant="subtitle2" component="div">
                                    Füllstand: {link.fuellstand ? link.fuellstand + '%' : 'Unbekannt'}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Zuletzt gemessen:
                                    <br />
                                    {dayjs(link.time).format("DD.MM.YYYY - HH:mm:ss")} Uhr
                                </Typography>
                                {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Lng: {link.longitude}
                                    <br />
                                    Lat: {link.latitude}
                                </Typography> */}

                            </CardContent>
                            <Divider variant="middle" component="li" />
                            <Box sx={{ display: 'flex' }}>
                                <CardActions sx={{
                                    display: 'flex',
                                    flex: '1',
                                    p: '0 16',

                                }}>

                                    {/* <Avatar
                                    src='smart-trash-logo.png'
                                    sx={{ width: 24, height: 24 }}
                                    aria-label="smart waste bin" /> */}

                                    <BatteryIcon akkustand={link?.akkustand} />
                                </CardActions>
                                <CardActions
                                    sx={{
                                        alignSelf: 'stretch',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-start',
                                        // 👇 Edit padding to further adjust position
                                        p: '0 16',
                                    }}
                                >
                                    <IconButton
                                        sx={{ p: '8 0' }}
                                        aria-label="info"
                                        onClick={() => {
                                            if (link.id != selectedBin?.boxId) { resetBinData(dispatch); }
                                            dispatch({ type: 'UPDATE_BIN', payload: link })
                                        }
                                        }>
                                        <InfoIcon />
                                    </IconButton>
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
export default BinsList;