import React, {useEffect, useState} from 'react';
import Login from '../pages/Login';
import IsLogin from '../pages/IsLogin';
import {useNavigation} from '@react-navigation/native';

import {getStorage} from '../utils/storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../slice/userSlice';
import Search from '../pages/Search';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
const Stack = createNativeStackNavigator();

const Client = () => {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [profile, setProfile] = useState({name: '', email: ''});

  const store = useSelector(state => state.user);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const getProfile = () => {
    KakaoLogin.getProfile()
      .then(result => {
        // console.log('GetProfile Success', JSON.stringify(result));
        setProfile({name: result.nickname, email: result.email});
      })
      .catch(error => {
        console.log(`GetProfile Fail(code:${error.code})`, error.message);
      });
  };

  const getToken = async () => {
    const res = await getStorage('accessToken');
    if (res !== null) {
      getProfile();
      const user = {
        name: profile.name,
        email: profile.email,
        accessToken: res,
        isLogin: true,
      };

      dispatch(setUser(user));
      setInitialRoute('IsLogin');
    } else {
      const initial = {
        name: '',
        email: '',
        accessToken: '',
        isLogin: false,
      };
      dispatch(setUser(initial));
      setInitialRoute('Login');
    }
  };

  useEffect(() => {
    getToken();
  });

  useEffect(() => {
    navigation.navigate(store.isLogin ? 'IsLogin' : 'Login');
  }, [navigation, store.isLogin]);

  useEffect(() => {
    console.log(store, 'store');
  }, [store]);

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      {!store.isLogin ? (
        <Stack.Screen
          name={'Login'}
          component={Login}
          options={{
            title: 'Login',
            headerShown: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name={'IsLogin'}
            component={IsLogin}
            options={{
              title: 'IsLogin',
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Client;
