import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import * as KakaoLogin from '@react-native-seoul/kakao-login';

import {height, width} from '../globalStyles';
import {setStorage} from '../utils/storage';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../slice/userSlice';

export function Login({navigation}) {
  const dispatch = useDispatch();

  const login = async () => {
    KakaoLogin.login()
      .then(result => {
        console.log('Login Success', JSON.stringify(result));

        const refreshToken = result.refreshToken;
        const accessToken = result.accessToken;
        setStorage('accessToken', accessToken);
        setStorage('refreshToken', refreshToken);

        const user = {
          isLogin: true,
        };
        dispatch(setUser(user)); // setUser 액션 디스패치
      })
      .catch(error => {
        if (error.code === 'E_CANCELLED_OPERATION') {
          console.log('Login Cancel', error.message);
        } else {
          console.log(`Login Fail(code:${error.code})`, error.message);
        }
      });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.btnCon}>
        <TouchableOpacity
          onPress={login}
          style={{...styles.Btn, backgroundColor: '#FEE500'}}>
          <View style={styles.textBox}>
            <Text style={styles.text}>카카오로 로그인</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#fff', justifyContent: 'space-between'},

  btnCon: {
    paddingHorizontal: width * 20,
    marginBottom: height * 20,
  },
  Btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 30,
    paddingVertical: height * 18,
    borderRadius: width * 20,
    marginBottom: height * 15,
    backgroundColor: '#fff',
    shadowColor: 'black', // 쉐도우 색상
    shadowOffset: {width: 0, height: 2}, // 쉐도우 위치 조절 (가로, 세로)
    shadowOpacity: 0.2, // 쉐도우 투명도
    shadowRadius: 4, // 쉐도우 반경 (퍼지는 정도)
    elevation: 6, // 안드로이드의 경우 쉐도우 효과를 지정하기 위해 elevation 사용
  },
  textBox: {
    borderLeftColor: '#000',
    borderLeftWidth: 2,
    marginLeft: width * 25,
    paddingLeft: width * 25,
  },
  text: {
    fontSize: width * 18,
    color: '#000',
  },
});
