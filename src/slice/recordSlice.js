import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: [],
};

const recordSlice = createSlice({
  name: 'record',
  initialState,
  reducers: {
    setRecord(state, action) {
      state.data = action.payload.data;
    },
  },
  extraReducers: builder => {},
});

export default recordSlice;

export const {setRecord} = recordSlice.actions;
