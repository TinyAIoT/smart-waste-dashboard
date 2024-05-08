import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import reducer from './reducer';

const initialState = {
  currentUser: null,
  openLogin: false,
  loading: false,
  chartLoading: false,
  alert: { open: false, severity: 'info', message: '' },
  profile: { open: false, file: null, photoURL: '' },
  images: [],
  details: { title: '', description: '', price: 0 },
  location: { lng: 0, lat: 0 },
  deletedImages: [],
  addedImages: [],
  bins: [],
  priceFilter: 50,
  addressFilter: null,
  filteredBins: [],
  bin: null,
  binData: [],
  binDataAll: { combined: null, names: null, ids: null },
  route: null,
  selectedBin: null,
  selectedBins: [],
  users: [],
  section: 0,
};

const Context = createContext(initialState);

export const useValue = () => {
  return useContext(Context);
};

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mapRef = useRef();
  const routeMapRef = useRef();
  const containerRef = useRef();
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      dispatch({ type: 'UPDATE_USER', payload: currentUser });
    }
  }, []);

  return (
    <Context.Provider value={{ state, dispatch, mapRef, containerRef, routeMapRef }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
