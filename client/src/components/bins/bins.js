import {
    Avatar,
    Card,
    Container,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Tooltip,
} from '@mui/material';
import { useValue } from '../../context/ContextProvider';
import BatteryIcon from '../utils/batteryIcons';
import { resetBinData } from '../../actions/bins';

const Bins = () => {
    const {
        state: { filteredBins, selectedBin },
        dispatch,
    } = useValue();

    return (
        <Container>
            <ImageList
                gap={12}
                sx={{
                    mb: 8,
                    gridTemplateColumns:
                        'repeat(auto-fill, minmax(280px, 1fr))!important',
                }}
            >
                {filteredBins.map((bin) => (
                    <Card key={bin.id} sx={{ maxHeight: 350 }}>
                        <ImageListItem sx={{ height: '100% !important' }}>
                            <ImageListItemBar
                                sx={{
                                    background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
                                }}
                                title={'Füllstand: ' + (bin?.fuellstand ? (bin?.fuellstand < 0 || bin?.fuellstand > 100 ? bin?.fuellstand + '% (Messung fehlerhaft)' : bin?.fuellstand + '%') : 'Kein Messwert vorhanden')}
                                subtitle={<BatteryIcon akkustand={bin?.akkustand} text={false} />}
                                actionIcon={
                                    <Tooltip title={bin.name} sx={{ mr: '5px' }}>
                                        <Avatar src='frog.jpeg' />
                                    </Tooltip>
                                }
                                position="top"
                            />
                            <img
                                src='frog.jpeg'
                                alt={bin.name}
                                loading="lazy"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    if (bin.id !== selectedBin?.boxId) { resetBinData(dispatch); }
                                    dispatch({ type: 'UPDATE_SELECTED_BIN', payload: bin })
                                    dispatch({ type: 'UPDATE_BIN', payload: bin });
                                }}
                            />
                            <ImageListItemBar
                                title={bin.name}
                            />
                        </ImageListItem>
                    </Card>
                ))}
            </ImageList>
        </Container>
    );
};

export default Bins;
