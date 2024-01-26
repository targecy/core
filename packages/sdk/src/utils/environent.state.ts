import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  environment: 'development', // default value
};

const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setEnvironment: (state, action) => {
      state.environment = action.payload;
    },
  },
});

export const { setEnvironment } = environmentSlice.actions;
export default environmentSlice.reducer;

export const getEnvironmentFromState = (state: any) => state.environment.environment;
