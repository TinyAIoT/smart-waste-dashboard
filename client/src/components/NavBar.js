import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
} from '@mui/material';
import { ChevronLeft, Lock } from '@mui/icons-material';

import { useValue } from '../context/ContextProvider';
import UserIcons from './user/UserIcons';
import Sidebar from './sidebar/Sidebar';
import { green, lightBlue, grey, amber } from '@mui/material/colors';
import RoutingSidebar from './routing/RoutingSidebar';
import RoutingInstructionsSidebar from './routing/RoutingInstructions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiamondTurnRight } from '@fortawesome/free-solid-svg-icons'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const {
    state: { currentUser, section, route },
    dispatch,
  } = useValue();
  // const ref = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [isInstructions, setIsInstructions] = useState(false);
  const [dark, setDark] = useState(true);
  const [googleMapsLink, setGoogleMapsLink] = useState('#');

  useEffect(() => {
    if (route) {
      let pointsString = 'https://www.google.com/maps/dir/'
      route.waypoints.forEach(point => {
        pointsString += point.location[1] + ',' + point.location[0] + '/'
      });
      setGoogleMapsLink(pointsString);
    }
  }, [route])

  useEffect(() => {
    // ref.current.ownerDocument.body.scrollTop = 0;
    if (section === 4 || section === 2) {
      setIsOpen(false)
    }
    else {
      setIsRouting(false)
    }
  }, [section]);

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: green,
          secondary: lightBlue,
          tertiary: {
            light: grey[300],
            main: grey[500],
          },
          amber: {
            main: amber[500]
          },
          // mode: dark ? 'dark' : 'light',
        },
      }),
    [dark]
  );

  const handleClick = () => {
    console.log(section);
    if (section !== 4 && section !== 2) {
      setIsOpen(!isOpen)
    }
    else {
      setIsRouting(!isRouting)
    }
  }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <AppBar>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Box sx={{ mr: 1 }}>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleClick}
                >
                  <MenuOpenIcon style={{ transform: 'rotate(180deg)' }} />
                </IconButton>
              </Box>
              {/* <Box sx={{ mr: 1 }}>
              <Avatar
                src="../../recycle-bin.png"
                component={Paper}
                elevation={2}
              />
            </Box> */}

              <Typography
                variant="h6"
                component="h1"
                noWrap
                sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
              >
                Smart City Dashboard Laer
              </Typography>

              <Typography
                variant="h6"
                component="h1"
                noWrap
                sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
              >
                SCDL
              </Typography>
              {!currentUser ? (
                <Button
                  color="inherit"
                  startIcon={<Lock />}
                  onClick={() => dispatch({ type: 'OPEN_LOGIN' })}
                >
                  Login
                </Button>
              ) : (
                <UserIcons />
              )}
              {section === 2 && route ? (
                <>
                  <Box sx={{ mr: 1 }}>
                    <Tooltip title="Route in Google Maps öffnen">
                      <IconButton
                        component={Link}
                        size='small'
                        sx={{ bgcolor: 'amber.main' }}
                        to={googleMapsLink + ''} target="_blank" rel="noopener noreferrer"
                      >
                        <Icon><FontAwesomeIcon icon={faDiamondTurnRight} /></Icon>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <IconButton
                      sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, bgcolor: 'grey.light' }}
                      size="small"
                      onClick={() => setIsInstructions(!isInstructions)}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <Button sx={{ ml: 2, display: { xs: 'none', md: 'flex' }, bgcolor: 'tertiary.light' }} variant='contained' onClick={() => setIsInstructions(!isInstructions)}>
                      <Typography
                        variant="subtitle2">
                        Wegbeschreibung
                      </Typography>
                      <MenuOpenIcon sx={{ ml: 1 }} size="small"> </MenuOpenIcon>
                    </Button>
                  </Box>
                </>
              ) : null}
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
      <Toolbar />
      <Sidebar {...{ isOpen, setIsOpen }} />
      <RoutingSidebar {...{ isRouting, setIsRouting }} />
      <RoutingInstructionsSidebar {...{ isInstructions, setIsInstructions }} />
    </>
  );
};



export default NavBar;
