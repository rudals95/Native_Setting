import {combineReducers} from '@reduxjs/toolkit';
import userSlice from '../slice/userSlice';
import tabBarSlice from '../slice/tabBarSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  tabBar: tabBarSlice.reducer,
});
export default rootReducer;
