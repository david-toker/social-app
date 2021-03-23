import React, { createContext, useReducer } from 'react'
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null,
  userImage: null
  // TODO: add username image
};

if(localStorage.getItem("allHereJwtToken")){
  const decodedToken = jwtDecode(localStorage.getItem("allHereJwtToken"));

  if(decodedToken.exp * 1000 < Date.now()){
    localStorage.removeItem("allHereJwtToken");
    localStorage.removeItem("allHereAvatar");
  } else {
    initialState.user = decodedToken;
    initialState.userImage = localStorage.getItem("allHereAvatar");
  }
}

const AuthContext = createContext({
  user: null,
  userImage: null,
  login: (userData) => {},
  logout: () => {},
  saveNewImage: (image) => {}
})

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return{
        ...state,
        user: action.payload,
        userImage: action.payload.urlImage
      }
    case 'LOGOUT':
      return{
        ...state,
        user: null
      }
    case 'UPDATE_IMAGE':
      return{
        ...state,
        userImage: action.payload
      }
    default:
      return state;
  }
}

function AuthProvider(props){
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData){
    localStorage.setItem("allHereJwtToken",userData.token);
    localStorage.setItem("allHereAvatar",userData.urlImage);
    dispatch({
      type: 'LOGIN',
      payload: userData
    })
  }

  function logout(){
    localStorage.removeItem("allHereJwtToken");
    localStorage.removeItem("allHereAvatar");
    dispatch({ type: 'LOGOUT' })
  }

  function saveNewImage(image){
    localStorage.removeItem("allHereAvatar");
    localStorage.setItem("allHereAvatar",image);
    dispatch({
      type: 'UPDATE_IMAGE',
      payload: image
    })
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout, userImage: state.userImage, saveNewImage }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };