import { Battery0Bar, Battery1Bar, Battery2Bar, Battery3Bar, Battery4Bar, Battery5Bar, BatteryFull } from "@mui/icons-material";
import { Box, Toolbar, Typography } from "@mui/material";

function BatteryIcon({ akkustand, text = true }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box>
                {(akkustand <= 0) ? <Battery0Bar style={{ transform: 'rotate(90deg)' }} color="secondary" /> : null}
                {(akkustand < 20 && akkustand > 0) ? <Battery1Bar style={{ transform: 'rotate(90deg)' }} htmlColor="#d21a1a" /> : null}
                {(akkustand < 40 && akkustand >= 20) ? <Battery2Bar style={{ transform: 'rotate(90deg)' }} htmlColor="#df612a" /> : null}
                {(akkustand < 60 && akkustand >= 40) ? <Battery3Bar style={{ transform: 'rotate(90deg)' }} htmlColor="#c98f1f" /> : null}
                {(akkustand < 80 && akkustand >= 60) ? (
                    <Battery4Bar style={{ transform: 'rotate(90deg)' }} htmlColor="#94bf19" />
                ) : null}
                {(akkustand < 100 && akkustand >= 80) ? <Battery5Bar style={{ transform: 'rotate(90deg)' }} htmlColor="#58ba1a" /> : null}
                {(akkustand === 100) ? <BatteryFull style={{ transform: 'rotate(90deg)' }} color="success" /> : null}
            </Box>
            {text && <Box>
                <Typography variant="caption" lineHeight={2} ml={1}>
                    {akkustand ? akkustand + '%' : 'Akkustand unbekannt'}
                </Typography>
            </Box>}
        </Box>
    )
}

export default BatteryIcon