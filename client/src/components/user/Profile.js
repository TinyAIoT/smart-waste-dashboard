import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { useValue } from '../../context/ContextProvider';
import { useRef } from 'react';
import { updateProfile } from '../../actions/user';

const Profile = () => {
  const {
    state: { profile, currentUser },
    dispatch,
  } = useValue();
  const nameRef = useRef();
  const grouptagRef = useRef();


  const handleClose = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { ...profile, open: false } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const grouptag = grouptagRef.current.value;
    updateProfile(currentUser, { name, file: profile.file, grouptag }, dispatch);
  };
  return (
    <Dialog open={profile.open} onClose={handleClose}>
      <DialogTitle>
        Profil
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Divider sx={{ mt: 2, mb: 2 }} >
            <DialogContentText variant='overline' >
              Einstellungen
            </DialogContentText>
          </Divider>
          <DialogContentText>
            Hier kann ihr Nutzername geändert werden:
          </DialogContentText>

          <TextField
            autoFocus
            margin="normal"
            variant="standard"
            id="name"
            label="Name"
            type="text"
            fullWidth
            inputRef={nameRef}
            inputProps={{ minLength: 2 }}
            required
            defaultValue={currentUser?.name}
          />
          <Divider sx={{ mt: 2, mb: 2 }} >
            <DialogContentText variant='overline' sx={{ color: 'red' }}>
              Fortgeschrittene Einstellugen
            </DialogContentText>
          </Divider>
          <DialogContentText >
            Hier kann das Grouptag zur Datenabfrage geändert werden:
          </DialogContentText>

          <TextField
            autoFocus
            margin="normal"
            variant="standard"
            id="grouptag"
            label="Grouptag"
            type="text"
            fullWidth
            inputRef={grouptagRef}
            inputProps={{ minLength: 2 }}
            required
            defaultValue={currentUser?.grouptag}
          />

        </DialogContent>
        <DialogActions sx={{ px: '19px' }}>
          <Button type="submit" variant="contained" endIcon={<Send />}>
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Profile;
