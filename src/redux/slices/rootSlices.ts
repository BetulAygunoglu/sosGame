import { combineReducers } from '@reduxjs/toolkit';
import networkReducer from './networkSlice'; 
import loadingReducer from './loadingSlice';
import languageReducer from './languageSlice';
import modalReducer from './modalSlice';

const appReducer = combineReducers({
  network: networkReducer, 
  loading: loadingReducer,
  language: languageReducer,
  modal: modalReducer
});

const rootReducer = (state: any, action: any) => {
  //reset logic on logout
  /* if (action.type === "auth/logout") {
    state = undefined; // <--- resets EVERYTHING
  } */
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
