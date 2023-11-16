import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {Head} from '../components/Head';
import API from '../utils/axios';
import {width} from '../globalStyles';
import {Button} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import moment from 'moment';

export function Detail({navigation, route}) {
  const timeStamp = new Date();
  const date = moment(new Date()).format('YYYY-MM-DD a HH:mm');
  const {id} = route.params;
  const [data, setData] = useState({
    id: '',
    title: '',
    content: '',
    fileName: '',
  });
  const [image, setImage] = useState(null);
  const [btn, setBtn] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const action = () => navigation.goBack();

  const iconData = {
    name: 'back',
    color: '#000',
    size: 35,
  };

  useEffect(() => {
    const getPostData = async () => {
      try {
        // postId로 해당 문서의 참조 가져오기
        const postRef = firestore().collection('posts').doc(id);
        // 문서의 데이터 가져오기
        const documentSnapshot = await postRef.get();

        if (documentSnapshot.exists) {
          // 문서가 존재하는 경우 데이터를 state로 설정
          setData({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
          if (documentSnapshot._data.fileName !== '')
            downloadImage(documentSnapshot._data.fileName);
        } else {
          console.log('문서가 존재하지 않습니다.');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
    const downloadImage = async fileName => {
      let url = '';
      try {
        const imageRef = await storage().ref(`media/${fileName}`);
        url = await imageRef.getDownloadURL();
        setImageUrl(url);

        // console.log(url);
      } catch (error) {
        console.error('이미지 다운로드 중 오류 발생:', error);
      }
    };
    getPostData();
  }, [id]);

  const handleKeyPress = e => {
    if (e.nativeEvent.key === 'Enter')
      setData(state => ({...state, content: state.content}));
  };
  const updatePost = async () => {
    const asset = image?.assets[0].fileName; //fileName 으로저장
    console.log(data.fileName, 'assetassetasset');
    try {
      const postRef = firestore().collection('posts').doc(id);
      // 수정할 필드 설정
      const updateData = {
        title: data.title,
        content: data.content,
        fileName: asset || data.fileName,
      };

      // 문서 업데이트
      await postRef.update(updateData);

      Alert.alert('Success', '글이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', '글 수정 중 오류가 발생했습니다.');
    }
  };

  const chooseImage = () => {
    const options = {
      mediaType: 'photo', // 사진 선택 설정
      // quality: 0.1, // 이미지 품질 (0.0 ~ 1.0)
      maxWidth: 512,
      maxHeight: 512,
      includeBase64: Platform.OS === 'android',
    };
    launchImageLibrary(options, res => {
      if (res.didCancel) console.log('사용자가 이미지 선택을 취소했습니다.');
      else if (res.error) console.log('에러 발생: ', res.error);
      else {
        // console.log(res, 'res');
        setImage(res);
      }
    });
  };

  const imageUpload = async () => {
    let imageUrl = null;

    if (image !== null) {
      const asset = image.assets[0];
      const reference = storage().ref(`/media/${asset.fileName}`); // 업로드할 경로 지정
      if (Platform.OS === 'android') {
        // 안드로이드
        // 파일 업로드
        await reference.putString(asset.base64, 'base64', {
          contentType: asset.type,
        });
      } else {
        // iOS
        // 파일 업로드
        await reference.putFile(asset.uri);
      }
      imageUrl = image ? await reference.getDownloadURL() : null;
    }
    // console.log('imageUrl', imageUrl);
  };

  return (
    <View style={{flex: 1}}>
      <Head title={'추가내용'} action={action} iconData={iconData} />
      <View style={styles.detail_con}>
        <View style={styles.detail_top}>
          <Image
            source={{uri: image?.assets[0]?.uri || imageUrl}}
            style={{flex: 1}}
          />
        </View>
        <View style={styles.detail_mid}>
          <ScrollView>
            <View style={styles.title_con}>
              <Text style={styles.title_style}>{data.title}</Text>
            </View>
            <View style={styles.content_con}>
              {btn ? (
                <TextInput
                  style={styles.input_style}
                  value={data.content}
                  placeholder="내용을 입력해주세요"
                  onChangeText={e => {
                    setData(state => ({...state, content: e}));
                  }}
                  onKeyPress={handleKeyPress}
                  multiline={true} // 여러 줄 입력 활성화
                  returnKeyType="done"
                />
              ) : (
                <Text style={styles.text_style}>{data.content}</Text>
              )}
            </View>
            <Text style={styles.date_style}> {data.date}</Text>
          </ScrollView>
        </View>
        <View style={styles.detail_bottom}>
          {btn ? (
            <>
              <Button title="이미지 선택" onPress={chooseImage} />
              <Button
                title="저장"
                onPress={() => {
                  setBtn(!btn);
                  updatePost();
                  imageUpload();
                }}
              />
            </>
          ) : (
            <Button
              title="수정"
              onPress={() => {
                setBtn(!btn);
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detail_con: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: width * 20,
  },
  detail_top: {
    flex: 4,
    backgroundColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    padding: width * 10,
  },
  detail_mid: {
    flex: 3,
    backgroundColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    padding: width * 10,
  },
  detail_bottom: {
    flex: 1,
    backgroundColor: '#ddd',
    // borderWidth: 1,
    padding: width * 10,
  },
  title_con: {
    marginBottom: 20,
  },
  content_con: {
    marginBottom: 20,
  },
  title_style: {
    fontWeight: '500',
    fontSize: width * 14,
    color: '#000',
  },
  text_style: {
    fontWeight: '700',
    fontSize: width * 16,
    color: '#000',
  },
  date_style: {
    fontWeight: '400',
    fontSize: width * 12,
    color: '#000',
  },
  input_style: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontWeight: '700',
    fontSize: width * 16,
    color: '#000',
  },
});
