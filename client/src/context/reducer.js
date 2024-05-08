const reducer = (state, action) => {
  switch (action.type) {
    // LOGIN
    case 'OPEN_LOGIN':
      return { ...state, openLogin: true };
    case 'CLOSE_LOGIN':
      return { ...state, openLogin: false };

    // LOADING
    case 'START_LOADING':
      return { ...state, loading: true };
    case 'END_LOADING':
      return { ...state, loading: false };
    case 'START_CHART_LOADING':
      return { ...state, chartLoading: true };
    case 'END_CHART_LOADING':
      return { ...state, chartLoading: false };


    // ALERT
    case 'UPDATE_ALERT':
      return { ...state, alert: action.payload };

    // USER
    case 'UPDATE_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_USER':
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
      return { ...state, currentUser: action.payload };
    case 'UPDATE_USERS':
      return { ...state, users: action.payload };

    // BINS
    case 'UPDATE_BINS':
      return {
        ...state,
        bins: action.payload,
        filteredBins: action.payload,
      };

    case 'UPDATE_BIN':
      return { ...state, bin: action.payload };

    case 'UPDATE_BIN_DATA':
      return { ...state, binData: action.payload }

    case 'UPDATE_BIN_DATA_ALL':
      return { ...state, binDataAll: action.payload }

    case 'UPDATE_SELECTED_BIN':
      return { ...state, selectedBin: action.payload };

    case 'UPDATE_SELECTED_BINS':
      return { ...state, selectedBins: [...state.selectedBins, ...action.payload] };

    case 'DELETE_FROM_SELECTED_BINS':
      return {
        ...state,
        selectedBins: state.selectedBins.filter((sBin) => sBin.id !== action.payload.id),
      };
    
      case 'DELETE_ALL_SELECTED_BINS':
      return { ...state, selectedBins: action.payload };


    // ROUTE
    case 'UPDATE_ROUTE':
      return { ...state, route: action.payload }

    // GEOCODER
    case 'FILTER_ADDRESS':
      return {
        ...state,
        addressFilter: action.payload,
        filteredBins: applyFilter(
          state.bins,
          action.payload,
        ),
      };
    case 'CLEAR_ADDRESS':
      return {
        ...state,
        addressFilter: null,
        filteredBins: state.bins,
      };

    // ROUTING
    case 'UPDATE_SECTION':
      return { ...state, section: action.payload };

    default:
      throw new Error('No matched action!');
  }
};

export default reducer;

const applyFilter = (bins, address) => {
  let filteredBins = bins;
  if (address) {
    const { lng, lat } = address;
    filteredBins = filteredBins.filter((bin) => {
      const lngDifference = Math.abs(lng - bin.longitude);
      const latDifference = Math.abs(lat - bin.latitude);
      return lngDifference <= 1 && latDifference <= 1;
    });
  }

  return filteredBins;
};
