import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Icon,
  Paper,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useEffect, useRef } from 'react';
import ClusterMap from './map/ClusterMap';
import Bins from './bins/bins';
import Protected from './protected/Protected';
import { useValue } from '../context/ContextProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import MultiChartPage from './charts/MultiChartPage';
import RoutePlanner from './routing/RoutePlanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute, faChartLine } from '@fortawesome/free-solid-svg-icons'

const BottomNav = () => {
  const {
    state: { section },
    dispatch,
  } = useValue();
  const ref = useRef();
  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [section]);
  return (
    <Box ref={ref}>
      {
        {
          0: (
            <Protected>
              <ClusterMap />,
            </Protected>),
          1: (
            <Protected>
              <Bins />,
            </Protected>),
          2: (
            <Protected>
              <RoutePlanner />,
            </Protected>
          ),
          3: (
            <Protected>
              <MultiChartPage />,
            </Protected>),
        }[section]
      }
      <Paper
        elevation={3}
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }}
      >
        <BottomNavigation
          showLabels
          value={section}
          onChange={(e, newValue) =>
            dispatch({ type: 'UPDATE_SECTION', payload: newValue })
          }
        >
          <BottomNavigationAction label="Karte" icon={<LocationOn />} />
          <BottomNavigationAction label="Tonnenübersicht" icon={<DeleteIcon />} />
          <BottomNavigationAction label="Routen" icon={<Icon> <FontAwesomeIcon icon={faRoute} /> </Icon>} />
          <BottomNavigationAction label="Datenansicht" icon={<Icon> <FontAwesomeIcon icon={faChartLine} /> </Icon>} />

        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
