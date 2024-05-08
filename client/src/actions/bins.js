import fetchBinData from './utils/fetchBinData';
import fetchBinDataAll from './utils/fetchBinDataMulti';
import fetchBins from './utils/fetchBins';
import fetchRoute from './utils/fetchRoute';

export const getBins = async (grouptag, dispatch) => {
  dispatch({ type: 'START_LOADING' });
  const result = await fetchBins(grouptag);
  if (result) {
    dispatch({ type: 'UPDATE_BINS', payload: result });
  }
  dispatch({ type: 'END_LOADING' });
};

export const getBinData = async (boxId, sensorId, batteryId, name, dispatch) => {
  dispatch({ type: 'START_CHART_LOADING' });
  const result = await fetchBinData(boxId, sensorId, batteryId, name, dispatch);
  if (result) {
    dispatch({ type: 'UPDATE_BIN_DATA', payload: result });
  }
  dispatch({ type: 'END_CHART_LOADING' });
};

export const resetBinData = async (dispatch) => {
    await dispatch({ type: 'UPDATE_BIN_DATA', payload: [] });
};


export const getBinDataAll = async (bins, dispatch) => {
  dispatch({ type: 'START_LOADING' });
  const result = await fetchBinDataAll(bins, dispatch);
  if (result) {
    dispatch({ type: 'UPDATE_BIN_DATA_ALL', payload: result });
  }
  dispatch({ type: 'END_LOADING' });
};



export const getRoute = async (dispatch, coordinates, start, end) => {
  dispatch({ type: 'START_LOADING' });
  const result = await fetchRoute(dispatch, coordinates, start, end);
  console.log(result);
  if (result) {
    dispatch({ type: 'UPDATE_ROUTE', payload: result });
  }
  dispatch({ type: 'END_LOADING' });
};