import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { contractsApi, relayerApi, backendApi } from '../services';

export const rootReducer = combineReducers({
  baseApi: contractsApi.reducer,
  relayerApi: relayerApi.reducer,
  backendApi: backendApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contractsApi.middleware).concat(relayerApi.middleware).concat(backendApi.middleware),
});
export type IRootState = ReturnType<typeof rootReducer>;
