import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Loading from './components/Loading';
import Notification from './components/Notification';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import BinDetail from './components/bins/binDetail';
import 'mapbox-gl/dist/mapbox-gl.css';

const App = () => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Loading />
        <Notification />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <BinDetail />
        {/* <RouteContainer /> */}
      </LocalizationProvider>
    </>
  );
};

export default App;