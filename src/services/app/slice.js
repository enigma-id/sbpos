import {createSlice} from '@reduxjs/toolkit';
import * as Action from './action';

const defineInitialState = () => ({
  ready: false,
  needUpdate: false,
});

const appSlice = createSlice({
  name: 'App',
  initialState: defineInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(Action.$reset, () => {
        return defineInitialState();
      })
      .addCase(Action.$config.fulfilled, state => {})
      .addCase(Action.$ready, (state, action) => {
        state.ready = true;
        state.needUpdate = false;
      })
      .addCase(Action.$needUpdate, (state, action) => {
        state.ready = true;
        state.needUpdate = true;
      });
  },
});

export const appReducer = appSlice.reducer;
