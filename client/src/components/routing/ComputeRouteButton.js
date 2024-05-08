import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import { getRoute } from '../../actions/bins';
import { Link } from 'react-router-dom';

const ComputeRouteButton = ({ isRouting, setIsRouting }) => {
  const {
    state: { selectedBins, route },
    dispatch,
  } = useValue();

  const [googleMapsLink, setGoogleMapsLink] = useState('#');


  const handleSubmit = () => {
    getRoute(dispatch, selectedBins.map((bin) => {
      return {
        name: bin.name,
        coords: [bin.longitude, bin.latitude]
      }
    }),
      [7.363, 52.070],
      [7.363, 52.0695]);
    setIsRouting(false);
  }

  useEffect(() => {
    if (route) {
      let pointsString = 'https://www.google.com/maps/dir/'
      route.waypoints.forEach(point => {
        pointsString += point.location[1] + ',' + point.location[0] + '/'
      });
      setGoogleMapsLink(pointsString);
    }
  }, [route])


  return (
    <>
      {!route ? <Box sx={{ mt: 5 }}>
        <Button variant="contained"
          onClick={() =>
            handleSubmit()}
        >
          Route berechnen
        </Button>
      </Box> : null
      }
      {route ? <Box sx={{ mt: 5 }}>
        <Button variant="contained"
          onClick={() =>
            handleSubmit()}
        >
          Route neu berechnen
        </Button>
      </Box> : null
      }
      {route ? <Box sx={{ mt: 5 }}>
        <Button
          component={Link}
          variant="contained"
          color='secondary'
          to={googleMapsLink + ''} target="_blank" rel="noopener noreferrer"
        >
          In Google Maps öffnen
        </Button>
      </Box> : null
      }
    </>
  );
};

export default ComputeRouteButton;
