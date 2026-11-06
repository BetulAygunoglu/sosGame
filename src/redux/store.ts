import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import rootSaga from './sagas/rootSaga';
import rootReducer from './slices/rootSlices'; 

// 1. Saga middleware oluşturuluyor
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',  
  storage, 
  whitelist: ['network', 'language'], // persist edilecek reducerlar
  timeout: 20000, 
};

// 4. Persist edilmiş reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 5. Store oluşturuluyor
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      // Redux Persist eylemlerini serializable check'ten muaf tutuyoruz
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ['meta.onSuccess', 'meta.onError'],
      },
    }).concat(sagaMiddleware),

});

// 6. Saga başlatılıyor
sagaMiddleware.run(rootSaga);

// 7. Persistor oluşturuluyor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;