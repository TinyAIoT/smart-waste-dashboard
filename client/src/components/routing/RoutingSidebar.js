import { Box, Divider, Drawer, IconButton, styled, Typography } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { useValue } from '../../context/ContextProvider';
import BinsRoutingList from './binsRoutingList';
import ComputeRouteButton from './ComputeRouteButton';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const RoutingSidebar = ({ isRouting, setIsRouting }) => {
  const { containerRef } = useValue();
  return (
    <Drawer variant="persistent" hideBackdrop={true} open={isRouting}>
      <DrawerHeader>
        <Typography variant='overline'>Routenplaner</Typography>
        <IconButton onClick={() => setIsRouting(false)}>
          <MenuOpenIcon fontSize="large" />
        </IconButton>
      </DrawerHeader>
      <Box sx={{ maxWidth: 360, p: 3 }}>
        <Box>
        <Typography variant='h6'> Verfügbare Mülleimer:</Typography>
        <Typography variant='subtitle2'> Wählen Sie beliebig viele Zwischenstopps aus der Liste durch einfach klicken. </Typography>
          <BinsRoutingList />
        </Box>
        <ComputeRouteButton {...{ isRouting, setIsRouting }}/>
      </Box>
    </Drawer>
  );
};

export default RoutingSidebar;
