import { Box, Divider, Drawer, IconButton, styled, Typography } from '@mui/material';
import BinsList from './binsList';
import { useValue } from '../../context/ContextProvider';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { containerRef } = useValue();
  return (
    <Drawer variant="persistent" hideBackdrop={true} open={isOpen}>
      <DrawerHeader>
        <Typography variant='overline'>Smart City Mülleimer</Typography>
        <IconButton onClick={() => setIsOpen(false)}>
          <MenuOpenIcon fontSize="large" />
        </IconButton>
      </DrawerHeader>
      <Box sx={{ width: 240, p: 3 }}>
        {/* <Typography> Adress-Suche:</Typography>
        <Box ref={containerRef}>
        </Box> */}
        {/* <br/> */}
        <Box>
          <Typography> Verfügbare Mülleimer:</Typography>
          <BinsList />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
