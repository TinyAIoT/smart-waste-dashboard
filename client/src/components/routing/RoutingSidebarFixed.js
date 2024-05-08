import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, styled, Typography } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { useValue } from '../../context/ContextProvider';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const RoutingSidebarFixed = () => {
  const {
    state: { route },
  } = useValue();
  const drawerWidth = 240;
  return (
    <Drawer
      variant="permanent"
anchor='right'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        zIndex: (theme) => theme.zIndex.drawer - 5
      }}
    >
      <DrawerHeader>
        <Typography>Routeninformationen</Typography>
        {/* <IconButton onClick={() => setIsOpen(false)}>
          <ChevronLeft fontSize="large" />
        </IconButton> */}
      </DrawerHeader>
      <Box sx={{ p: 3 }}>
        <Typography variant='subtitle2'> Zusammenfassung:</Typography>
        <List dense>
          <ListItem>
            <ListItemText
              secondary={'Stopps: ' + (route?.trips[0].legs.length)} />
          </ListItem>
          <ListItem>
            <ListItemText
              secondary={'Fahrzeit: ' + (route?.trips[0].duration / 60) + 'min'} />
          </ListItem>
          <ListItem>
            <ListItemText
              secondary={'Distanz: ' + (Math.round(route?.trips[0].distance / 10) / 100
              ) + 'km'} />
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
                  <Paper elevation={1}>
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

export default RoutingSidebarFixed;
