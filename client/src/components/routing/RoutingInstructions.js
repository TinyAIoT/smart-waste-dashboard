import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, styled, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, Delete } from '@mui/icons-material';
import { useValue } from '../../context/ContextProvider';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const RoutingInstructionsSidebar = ({ isInstructions, setIsInstructions }) => {
  const {
    state: { route },
  } = useValue();
  const drawerWidth = 240;
  const durationHour = Math.floor(route?.trips[0].duration / 3600).toLocaleString('de-DE', { minimumIntegerDigits: 2, useGrouping: false });
  const durationMin = Math.floor(route?.trips[0].duration / 60 % 60).toLocaleString('de-DE', { minimumIntegerDigits: 2, useGrouping: false });
  const durationSec = Math.floor(route?.trips[0].duration % 60).toLocaleString('de-DE', { minimumIntegerDigits: 2, useGrouping: false });
  return (
    <Drawer
      variant="persistent"
      anchor='right'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        zIndex: (theme) => theme.zIndex.drawer - 5
      }}
      open={isInstructions}
    >
      <DrawerHeader>
        <IconButton onClick={() => setIsInstructions(false)}>
          <MenuOpenIcon fontSize='large' style={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Typography variant='overline'>Routeninformationen</Typography>
      </DrawerHeader>
      <Box sx={{ p: 3 }}>
        <Typography variant='subtitle2'> Zusammenfassung:</Typography>
        <List dense>
          <ListItem>
            <ListItemText
              secondary={'Stopps: ' + (route?.trips[0].legs.length - 1)} />
          </ListItem>
          <ListItem>
            <ListItemText
              secondary={'Fahrzeit: ' + durationHour + ':' + durationMin + ':' + durationSec + ' Stunden'} />
          </ListItem>
          <ListItem>
            <ListItemText
              secondary={'Distanz: ' + (Math.round(route?.trips[0].distance / 10) / 100
              ) + ' km'} />
          </ListItem>
        </List>
        <br />
        <Typography variant="subtitle2"> Navigationsanweisungen: </Typography>
        {route?.trips[0].legs.map((leg, legIndex) => {
          return <Box>
            <List dense
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Strecke {legIndex + 1}
                </ListSubheader>
              }
            >

              {leg.steps.map((step, index) => {
                return (
                  <Paper elevation={1} key={index}>
                    <ListItem>
                      <ListItemText
                        secondary={(index + 1) + '. ' + step.maneuver.instruction}
                      />
                    </ListItem>
                  </Paper>
                )
              })}
            </List>

          </Box>
        })}
        <br />
        <Divider />
        <br />
      </Box>
    </Drawer>
  );
};

export default RoutingInstructionsSidebar;
