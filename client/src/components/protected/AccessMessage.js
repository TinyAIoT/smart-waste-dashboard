import { Lock } from '@mui/icons-material';
import { Alert, AlertTitle, Button, Container } from '@mui/material';
import React from 'react';
import { useValue } from '../../context/ContextProvider';

const AccessMessage = () => {
  const { dispatch } = useValue();
  return (
    <Container sx={{ py: 10 }}>
      <Alert severity="error" variant="outlined">
        <AlertTitle>Zugang untersagt</AlertTitle>
        Bitte logge dich ein oder registriere dich um auf diese Seite zuzugreifen
        {/* Please login or register to access this page */}
        <br/>
        <br/>
        <Button
          variant="outlined"
          // sx={{ ml: 2 }}
          startIcon={<Lock />}
          onClick={() => dispatch({ type: 'OPEN_LOGIN' })}
        >
          login
        </Button>
      </Alert>
    </Container>
  );
};

export default AccessMessage;
