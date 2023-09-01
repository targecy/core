import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from '../services';
export const rootReducer = combineReducers({
  baseApi: api.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});
export type IRootState = ReturnType<typeof rootReducer>;
