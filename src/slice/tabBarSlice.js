import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tabBar: false,
};

const tabBarSlice = createSlice({
  name: 'tabBar',
  initialState,
  reducers: {
    setTabBar(state, action) {
      state.tabBar = action.payload.tabBar;
    },
  },
  extraReducers: builder => {},
});

export default tabBarSlice;

export const {setTabBar} = tabBarSlice.actions;
