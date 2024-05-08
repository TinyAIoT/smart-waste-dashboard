import { Delete } from '@mui/icons-material';
import { Avatar, Badge, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import useCheckToken from '../../hooks/useCheckToken';
import UserMenu from './UserMenu';

const UserIcons = () => {
  useCheckToken();
  const {
    state: { currentUser, filteredBins },
  } = useValue();

  const [anchorUserMenu, setAnchorUserMenu] = useState(null);
  const [emptyBins, setEmptyBins] = useState(0);
  const [mediumBins, setMediumBins] = useState(0);
  const [fullBins, setFullBins] = useState(0);
  const [undefinedBins, setUndefinedBins] = useState(0);

  useEffect(() => {
    if (filteredBins) {
      let eb = 0;
      let mb = 0;
      let fb = 0;
      let ub = 0;
      filteredBins.forEach(bin => {
        const fuellstand = parseInt(bin.fuellstand)
        if (fuellstand < 40) {
          eb += 1
        } else if (fuellstand < 70) {
          mb += 1
        } else if (fuellstand <= 100) {
          fb += 1
        } else {
          ub += 1
        }
      });
      setEmptyBins(eb + '');
      setMediumBins(mb + '');
      setFullBins(fb + '');
      setUndefinedBins(ub + '');
    }
  }, [filteredBins])

  return (
    <>
      <Grid container>
        <Grid container spacing={0} rowSpacing={0} sx={{ width: '5rem', height: '5rem', pt: 1 }}>
          <Grid xs='auto' display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Leere Mülleimer (0 - 35%)">
              <IconButton size="small" color="inherit">
                <Badge color="success" badgeContent={emptyBins}>
                  <Delete color="success" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid xs='auto' display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Halbvolle Mülleimer (40 - 65%)">
              <IconButton size="small" color="inherit">
                <Badge color="warning" badgeContent={mediumBins}>
                  <Delete color="warning" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid xs='auto' display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Volle Mülleimer (> 70%)">
              <IconButton size="small" color="inherit">
                <Badge color="error" badgeContent={fullBins}>
                  <Delete color="error" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid xs='auto' display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Mülleimer ohne Messwerte">
              <IconButton size="small" color="inherit">
                <Badge color="default" badgeContent={undefinedBins}>
                  <Delete />
                </Badge>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
        <Tooltip title="Open User Settings">
          <IconButton onClick={(e) => setAnchorUserMenu(e.currentTarget)}>
            <Avatar sx={{ ml: 0, mr: 2, display: { xs: 'flex', md: 'none' } }}
              src={currentUser?.photoURL} alt={currentUser?.name}>
              {currentUser?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Avatar sx={{ ml: 1, mr: 2, display: { xs: 'none', md: 'flex' } }}
              src={currentUser?.photoURL} alt={currentUser?.name}>
              {currentUser?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
        <UserMenu {...{ anchorUserMenu, setAnchorUserMenu }} />
      </Grid>
    </>
  );
};

export default UserIcons;
