import { Box, Card, ImageListItem, ImageListItemBar } from '@mui/material';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/lazy';
import { useValue } from '../../context/ContextProvider';
import BinChart from '../charts/chart';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import IconButton from '@mui/material/IconButton';


const PopupBin = ({ popupInfo }) => {
  const { name, fuellstand, time } = popupInfo;
  const {
    dispatch
  } = useValue();
  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* <ChartLoading /> */}
      <ImageListItem sx={{ display: 'block' }}>
        <ImageListItemBar
          sx={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
            zIndex: 2,
          }}
          title={fuellstand + '% gefüllt'}
          position="top"
        />
        <ImageListItemBar
          title={name}
          subtitle={'Letzte Messung: ' + dayjs(time).format("DD.MM.YYYY - HH:mm:ss")}
          sx={{ zIndex: 2 }}
          actionIcon={
            <IconButton
              sx={{ color: 'white' }}
              onClick={() =>
                dispatch({ type: 'UPDATE_BIN', payload: popupInfo })
              }
            >
              <FullscreenIcon />
            </IconButton>

          }
        >
        </ImageListItemBar>

        <Box
          alt="bin"
          sx={{
            height: 255,
            width: 400,
            display: 'block',
            overflow: 'hidden',
            cursor: 'pointer',
            objectFit: 'cover',
          }}
        >
          <BinChart />
        </Box>
      </ImageListItem>
    </Card>
  );
};

export default PopupBin;
