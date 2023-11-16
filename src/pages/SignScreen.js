import React, {useState} from 'react';
import {getUser} from '../../lib/users';
import {signIn} from '../../lib/auth';
import {Text, View} from 'react-native';
import {Button} from 'react-native';

function SignInScreen({navigation, route}) {
  const [form, setForm] = useState({
    email: '11',
    password: '111',
    confirmPassword: '111',
  });

  const signIn = async () => {
    const {email, password} = form;
    const info = {email, password};
    try {
      const {user} = await signIn(info); // 로그인
      const profile = await getUser(user.uid); // 프로필 조회
      if (!profile) {
        // 저장된 프로필이 없다면
        navigation.navigate('SetupProfileScreen', {uid: user.uid}); // 프로필 입력 화면으로 이동
      }
    } catch (e) {
      Alert.alert('로그인 실패', '로그인에 실패하였습니다.');
    }
  };

  return (
    <View>
      <Text>dd</Text>
      <Button title="ddd" onPress={signIn} />
    </View>
  );
}

export default SignInScreen;
