import React, {useEffect} from 'react';
import store from './src/store';
import {Provider} from 'react-redux';

import AppStatusBar from './src/components/AppStatusBar';
// import SplashScreen from 'react-native-splash-screen';

import {NavigationContainer} from '@react-navigation/native';
import {Text, View} from 'react-native';
import {width} from './src/globalStyles';
import CustomIcon from './src/pages/CustomIcon';

const App = () => {
  return (
    <Provider store={store}>
      <AppStatusBar />
      <View style={{backgroundColor: '#ddf', flex: 1}}>
        <CustomIcon name={'nav-left1'} size={width * 30} color={'#000'} />
        <CustomIcon name={'sort'} size={width * 30} color={'#000'} />
        <CustomIcon name={'more-vertical'} size={width * 30} color={'#000'} />
        <CustomIcon name={'search'} size={width * 30} color={'#000'} />
        <CustomIcon name={'calender'} size={width * 30} color={'#000'} />
        <CustomIcon name={'settings'} size={width * 30} color={'#000'} />
      </View>
    </Provider>
  );
};

export default App;
