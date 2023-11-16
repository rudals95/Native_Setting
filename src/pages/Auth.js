import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
// import Toast from 'react-native-toast-message';

export default function Auth() {
  const PasswordInput = useRef();
  const [navCheck, setNavCheck] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState('');

  const onSubmitEmail = () => {
    PasswordInput.current.focus();
  };

  const btnAlloter = () => {
    if (navCheck == 'Login') {
      return loginEditing;
    } else {
      return signupEditing;
    }
  };

  const loginEditing = async () => {
    console.log('로그인');
    setLoading(true);
    // 두번눌리는걸 방지
    if (loading) {
      return;
    }
    try {
      if (email !== '' && password !== '') {
        // 입력값이 공백이 아니면 로그인
        const res = await auth().signInWithEmailAndPassword(email, password);
        console.log(res, 'res');
      } else if (email === '') {
        // showToast('error', 'email 를 입력해주세요');
      } else if (password === '') {
        // showToast('error', 'password 를 입력해주세요');
      } else {
        // 입력값이 공백이라면 유효성 체크 메시지 출력
        setLoading(false);
        // showToast('error', 'email,password 를 입력해주세요');
      }
    } catch (e) {
      // 에러 발생시 에러이유를 유효성 체크 메시지로 출력
      console.log(e.code);
      setLoading(false);
      switch (e.code) {
        case 'auth/too-many-requests': {
          // return showToast('error', '잠시후 다시 입력해주세요');
        }
        case 'auth/invalid-email': {
          // return showToast('error', '이메일을 입력해주세요');
        }
        case 'auth/user-disabled': {
          // return showToast('error', 'user-disabled');
        }
        case 'auth/user-not-found': {
          // return showToast('존재하지 않는 이메일 입니다');
        }
        case 'auth/wrong-password': {
          // return showToast('error', '비밀번호가 일치하지 않습니다');
        }
        case 'auth/operation-not-allowed': {
          // return showToast(
          //   'error',
          //   'auth/operation-not-allowed \n관리자에게 문의하세요',
          // );
        }
      }
    }
  };

  const signupEditing = async () => {
    setLoading(true);
    if (loading) {
      return;
    }
    try {
      if (email !== '' && password !== '') {
        const res = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        // showToast('success', '가입되었습니다');

        console.log(res, 'res');
      } else {
        setLoading(false);
        setValidation('칸을 채워주세요');
      }
    } catch (e) {
      setLoading(false);
      switch (e.code) {
        case 'auth/too-many-requests': {
          return setValidation('잠시후 다시 입력해주세요2');
        }
        case 'auth/email-already-in-use': {
          return setValidation('이미 사용중인 이메일입니다.');
        }
        case 'auth/invalid-email': {
          return setValidation('이메일을 입력해주세요');
        }
        case 'auth/weak-password': {
          return setValidation(
            '안전하지 않은 비밀번호입니다.\n다른 비밀번호를 사용해 주세요.',
          );
        }
        case 'auth/operation-not-allowed': {
          return setValidation(
            'operation-not-allowed \n관리자에게 문의하세요 ',
          );
        }
      }
      console.log(e.code, 'code');
    }
  };

  // const showToast = (type = 'success', text1, text2 = '') => {
  //   Toast.show({
  //     type: type,
  //     text1: text1,
  //     text2: text2,
  //     position: 'top',
  //     visibilityTime: 3000,
  //     topOffset: 40,
  //   });
  // };
  return (
    <>
      <View style={styles.container}>
        {/* <Toast /> */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.TextArea}
            placeholder="이메일"
            value={email}
            returnKeyType="next"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={text => setEmail(text)}
            onSubmitEditing={onSubmitEmail}
          />
          <TextInput
            style={styles.TextArea}
            ref={PasswordInput}
            placeholder="비밀번호"
            value={password}
            returnKeyType="done"
            secureTextEntry
            onChangeText={text => setPassword(text)}
            onSubmitEditing={btnAlloter()}
          />
          <Button
            title={navCheck === 'Login' ? '로그인' : '가입'}
            onPress={btnAlloter()}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  TextArea: {
    height: 40,
    // margin: 10,
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
});
