import {
    AppBar,
    Avatar,
    Box,
    Container,
    Dialog,
    IconButton,
    Slide,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    createTheme,
} from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import { Close } from '@mui/icons-material';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow, Lazy, Zoom } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/lazy';
import 'swiper/css/zoom';
import './swiper.css';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import BinChart from '../charts/chart';
import { green, purple } from '@mui/material/colors';
import BatteryIcon from '../utils/batteryIcons';


const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" {...props} ref={ref} />;
});

const BinDetail = () => {
    const {
        state: { bin },
        dispatch,
    } = useValue();

    const [place, setPlace] = useState(null);

    useEffect(() => {
        if (bin) {
            dispatch({ type: 'UPDATE_SELECTED_BIN', payload: bin });
            console.log(bin);
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${bin.longitude},${bin.latitude}.json?access_token=${process.env.REACT_APP_MAP_TOKEN}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => setPlace(data.features[0]));
        }
    }, [bin]);

    const handleClose = () => {
        dispatch({ type: 'UPDATE_BIN', payload: null });
    };

    const purpleTheme = createTheme({
        palette: {
            primary: purple,
            secondary: green
        },
    })

    return (
        <Dialog
            fullScreen
            open={Boolean(bin)}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar position="relative" theme={purpleTheme}>
                <Toolbar>
                    <Typography variant="h6" component="h3" sx={{ ml: 2, flex: 1 }}>
                        {bin?.name}
                    </Typography>
                    <IconButton color="inherit" onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container sx={{ pt: 5 }}>
                <Swiper
                    modules={[Navigation, Autoplay, EffectCoverflow, Lazy, Zoom]}
                    centeredSlides
                    slidesPerView={2}
                    grabCursor
                    navigation
                    autoplay
                    lazy
                    zoom
                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                >
                    {bin?.images?.map((url) => (
                        <SwiperSlide key={url}>
                            <div className="swiper-zoom-container">
                                <img src={url} alt="bin" />
                            </div>
                        </SwiperSlide>
                    ))}
                    <Tooltip
                        title={bin?.uName || ''}
                        sx={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            zIndex: 2,
                        }}
                    >
                        <Avatar src={bin?.uPhoto} />
                    </Tooltip>
                </Swiper>
                <Stack sx={{ p: 3 }} spacing={2}>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box>
                            <Typography variant="h6" component="span">
                                {'Letzter Füllstand: '}
                            </Typography>
                            <Typography component="span">
                                {bin?.fuellstand === undefined ? 'Keine Messung vorhanden' : (bin?.fuellstand < 0 || bin?.fuellstand > 100) ? bin?.fuellstand + '% (Messung außerhalb des logischen Wertebereichs)' : bin?.fuellstand + '%'}
                            </Typography>
                        </Box>
                        <Box
                        // sx={{
                        //     display: 'flex',
                        //     alignItems: 'center',
                        // }}
                        >
                            <Typography variant="h6" component="span">
                                {'Zuletzt gemessen um: '}
                            </Typography>
                            <Typography component="span">
                                {bin?.time ? dayjs(bin?.time).format("DD.MM.YYYY - HH:mm:ss").toString() + ' Uhr' : 'Keine Messung vorhanden'}
                            </Typography>
                        </Box>
                        <Box>
                            <BatteryIcon akkustand={bin?.akkustand} />
                        </Box>
                    </Stack>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box>
                            <Typography variant="h6" component="span">
                                {'Ortsbezeichnung: '}
                            </Typography>
                            <Typography component="span">{place?.text}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6" component="span">
                                {'Addresse: '}
                            </Typography>
                            <Typography component="span">{place?.place_name}</Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Typography variant="h6" component="span">
                            {'Weitere Infromationen: '}
                        </Typography>
                        <Typography component="span">Longitude: {bin?.longitude}</Typography>
                        <Typography component="span">Latitude: {bin?.latitude}</Typography>
                    </Stack>
                    <Box>
                        <BinChart />
                    </Box>
                </Stack>
            </Container>
        </Dialog>
    );
};

export default BinDetail;
