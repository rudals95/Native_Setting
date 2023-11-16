import React, {useEffect} from 'react';
import {Head} from '../components/Head';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Body} from '../components/Body';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Platform, StatusBar} from 'react-native';
import Test from '../components/Test';

export function Main() {
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;
  const action = () => {
    console.log('dd');
  };
  const iconData = {
    name: 'nav-left1',
    color: '#000',
    size: 25,
  };
  return (
    <>
      <Head title={'메모'} action={action} iconData={iconData} />
      <GestureHandlerRootView style={{flex: 1}}>
        {/* <Body StatusBarHeight={StatusBarHeight} /> */}
        <Test />
      </GestureHandlerRootView>
    </>
  );
}
