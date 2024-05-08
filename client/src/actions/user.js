import { getBins } from './bins';
import fetchData from './utils/fetchData';

const url = process.env.REACT_APP_SERVER_URL + '/user';

export const register = async (user, dispatch) => {
  dispatch({ type: 'START_LOADING' });

  const result = await fetchData(
    { url: url + '/register', body: user },
    dispatch
  );
  if (result) {
    dispatch({ type: 'UPDATE_USER', payload: result });
    dispatch({ type: 'CLOSE_LOGIN' });
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'success',
        message: 'Your account has been created successfully',
      },
    });
  }

  dispatch({ type: 'END_LOADING' });
};

export const login = async (user, dispatch) => {
  dispatch({ type: 'START_LOADING' });

  const result = await fetchData({ url: url + '/login', body: user }, dispatch);
  if (result) {
    dispatch({ type: 'UPDATE_USER', payload: result });
    dispatch({ type: 'CLOSE_LOGIN' });
  }

  dispatch({ type: 'END_LOADING' });
};

export const updateProfile = async (currentUser, updatedFields, dispatch) => {
  dispatch({ type: 'START_LOADING' });

  const { name, grouptag } = updatedFields;
  let body = { name, grouptag };
  try {
    const result = await fetchData(
      {
        url: url + '/updateProfile',
        method: 'PATCH',
        body,
        token: currentUser.token,
      },
      dispatch
    );
    if (result) {
      dispatch({ type: 'UPDATE_USER', payload: { ...currentUser, ...result } });
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'success',
          message: 'Your profile has been updated successfully',
        },
      });
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: { open: false, file: null, photoURL: result.photoURL },
      });
      getBins(grouptag, dispatch);
      dispatch({ type: 'DELETE_ALL_SELECTED_BINS', payload: [] });
    }
  } catch (error) {
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'error',
        message: error.message,
      },
    });
    console.log(error);
  }

  dispatch({ type: 'END_LOADING' });
};

export const getUsers = async (dispatch, currentUser) => {
  const result = await fetchData(
    { url, method: 'GET', token: currentUser.token },
    dispatch
  );
  if (result) {
    dispatch({ type: 'UPDATE_USERS', payload: result });
  }
};

export const updateStatus = (updatedFields, userId, dispatch, currentUser) => {
  return fetchData(
    {
      url: `${url}/updateStatus/${userId}`,
      method: 'PATCH',
      token: currentUser.token,
      body: updatedFields,
    },
    dispatch
  );
};

export const logout = (dispatch) => {
  dispatch({ type: 'UPDATE_USER', payload: null });
  dispatch({ type: 'UPDATE_USERS', payload: [] });
};
