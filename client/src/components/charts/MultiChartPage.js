import BinChartMulti from "./charts";
import {
    Box,
} from '@mui/material';


const MultiChartPage = () => {
    return (
        <Box sx={{ pt: 5, maxHeight: '80vh', display: "flex", alignItems: "center", justifyContent: 'center' }}>
            <BinChartMulti />
        </Box>
    );
};

export default MultiChartPage;
