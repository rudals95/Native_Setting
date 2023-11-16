import React, {useEffect, useState} from 'react';
import store from './src/store';
import {Provider} from 'react-redux';

import AppStatusBar from './src/components/AppStatusBar';

import {NavigationContainer} from '@react-navigation/native';
import {Platform, Text, View} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Detail} from './src/pages/Detail';
import {Main} from './src/pages/Main';
import auth from '@react-native-firebase/auth';
import Auth from './src/pages/Auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      // console.log(user, 'user');
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <AppStatusBar />
      {!isLoggedIn ? (
        <Auth isLoggedIn={isLoggedIn} />
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={'Main'}
            screenOptions={{
              tabBarLabelStyle: {
                fontSize: 18,
                marginBottom: Platform.OS !== 'ios' ? 20 : 0,
              },
            }}>
            <Stack.Screen
              name="Main"
              component={Main}
              options={{
                title: 'Main',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Detail"
              component={Detail}
              options={{
                title: 'Detail',
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </Provider>
  );
};

export default App;
