import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import { useValue } from '../context/ContextProvider';

const ChartLoading = () => {
  const {
    state: { chartLoading },
  } = useValue();
  return (
    <Backdrop open={chartLoading} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
      <CircularProgress sx={{ color: 'white' }} />
    </Backdrop>
  );
};

export default ChartLoading;
