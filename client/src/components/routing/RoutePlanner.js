import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import '../map/cluster.css';
import { AppBar, Avatar, Box, Container, CssBaseline, Dialog, IconButton, Menu, Paper, Slide, Toolbar, Tooltip, Typography, createTheme } from '@mui/material';
import { green, purple } from '@mui/material/colors';
import { Close } from '@mui/icons-material';
import RoutingSidebar from './RoutingSidebar';
import { GridMenuIcon } from '@mui/x-data-grid';
import NavMap from './NavMap';
import RoutingInstructionsSidebar from './RoutingInstructions';

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" {...props} ref={ref} />;
});

const RoutePlanner = () => {
    const {
        state: { route },
        dispatch
    } = useValue();
    const [dark, setDark] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        dispatch({ type: 'UPDATE_ROUTE', payload: null });
    };

    const purpleTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    primary: purple,
                    secondary: green,
                    // mode: dark ? 'dark' : 'light',
                },
            }),
        [dark]
    );

    return (
        <Box
            sx={{ display: 'flex' }}
        >
            <RoutingSidebar {...{ isOpen, setIsOpen }} />
            <CssBaseline />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <NavMap></NavMap>
            </Box>
            <RoutingInstructionsSidebar />
        </Box>
    );
}

export default RoutePlanner;
