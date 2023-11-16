import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {height, width} from '../globalStyles';
import CustomIcon from '../pages/CustomIcon';
import {Easing} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {firebase} from '@react-native-firebase/auth';

export default function Test() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [borderColorAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const [content] = useState('');
  const screenWidth = Math.round(Dimensions.get('window').width);
  const [itemState, setItemState] = useState({
    setting: false,
    listIndex: null,
    loading: false,
  });

  useEffect(() => {
    // 'posts' 컬렉션의 데이터를 가져오기
    const unsubscribe = firestore()
      .collection('posts')
      // .orderBy('timeStamp', 'desc')
      .orderBy('index', 'asc')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setPosts(data);
      });
    return () => unsubscribe();
  }, []);
  const textAddHandler = useCallback(
    e => {
      setAddTitle(e);
    },
    [addTitle],
  );
  const textValueHandler = useCallback(
    e => {
      setTitle(e);
    },
    [title],
  );
  const date = moment(new Date()).format('YYYY-MM-DD a HH:mm');
  const timeStamp = new Date();
  const saveToFirestore = useCallback(async () => {
    try {
      // 'posts'는 Firestore에 생성한 컬렉션 이름입니다.
      await firestore()
        .collection('posts')
        .add({
          title: addTitle,
          content,
          date,
          timeStamp,
          fileName: '',
          index: posts.length + 1,
        });
      //   Alert.alert('Success', '글이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      Alert.alert('Error', '글 저장 중 오류가 발생했습니다.');
    }
    setAddTitle('');
  }, [addTitle]);

  const updatePost = async (item, title) => {
    try {
      // 해당 문서의 참조 가져오기
      const postRef = firestore().collection('posts').doc(item.id);

      // 수정할 필드 설정
      const updateData = {
        title: title,
      };

      // 문서 업데이트
      await postRef.update(updateData);
      setItemState(state => ({
        ...state,
        listIndex: null,
        setting: false,
      }));
      //   Alert.alert('Success', '글이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', '글 수정 중 오류가 발생했습니다.');
    }
  };

  const deletePost = async item => {
    try {
      // 해당 문서의 참조 가져오기
      const postRef = firestore().collection('posts').doc(item.id);

      // 문서 삭제
      await postRef.delete();
      setItemState(state => ({
        ...state,
        listIndex: null,
        setting: false,
      }));
      Alert.alert('Success', '글이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', '글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleFocus = () => {
    animateBorderColor(1);
  };
  const handleBlur = () => animateBorderColor(0);

  const animateBorderColor = toValue => {
    Animated.timing(borderColorAnimation, {
      toValue: toValue,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };
  const animatedBorderStyle = {
    borderWidth: borderColorAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2],
    }),
    borderColor: borderColorAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ccc', 'skyblue'],
    }),
  };

  const updateList = async data => {
    const batch = firestore().batch();
    data.forEach((a, index) => {
      const postRef = firestore().collection('posts').doc(a.id);
      batch.update(postRef, {index});
    });
    await batch.commit();
  };

  const renderItem = ({item, drag, isActive}) => {
    const {index} = item;
    return (
      <>
        <ScaleDecorator>
          <View style={[styles.list_itme_style]}>
            <TouchableOpacity style={styles.star_btn_style}>
              {item.star ? (
                <CustomIcon
                  name={'star-fill'}
                  size={width * 25}
                  color={'#000'}
                />
              ) : (
                <CustomIcon
                  name={'star-line'}
                  size={width * 25}
                  color={'#000'}
                />
              )}
            </TouchableOpacity>
            <View style={styles.text_input_style}>
              {itemState.listIndex === index ? (
                <View
                  style={[
                    {
                      flex: 1,
                      justifyContent: 'center',
                    },
                  ]}>
                  <TextInput
                    style={{
                      fontSize: width * 16,
                      color: '#000',
                      textAlignVertical: 'center',
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 5,

                      flex: 1,
                    }}
                    defaultValue={item.title}
                    onFocus={() => {
                      setItemState(state => ({...state, setting: true}));
                    }}
                    onChangeText={textValueHandler}
                    onSubmitEditing={() => {
                      updatePost(item, title);
                    }}
                  />
                </View>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate('Detail', {id: item.id, idx: index});
                  }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{fontSize: width * 16, color: '#000'}}>
                    {item.title}
                  </Text>
                </TouchableWithoutFeedback>
              )}
            </View>
            {index === itemState.listIndex && (
              <TouchableOpacity
                disabled={isActive}
                onPress={() => {
                  deletePost(item);
                }}
                style={[
                  styles.rowItem,
                  {
                    padding: width * 5,
                    justifyContent: 'center',
                  },
                ]}>
                <CustomIcon name={'delete'} size={width * 20} color={'#000'} />
              </TouchableOpacity>
            )}
            {itemState.listIndex === index ? (
              <TouchableOpacity
                style={[
                  styles.rowItem,
                  {
                    padding: width * 5,
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => {
                  setItemState(state => ({
                    ...state,
                    listIndex: null,
                    setting: false,
                  }));
                }}>
                <CustomIcon name={'reset'} size={width * 20} color={'#000'} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.rowItem,
                  {
                    padding: width * 5,
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => {
                  setItemState(state => ({
                    ...state,
                    listIndex: index,
                    setting: true,
                  }));
                }}>
                <CustomIcon
                  name={'settings'}
                  size={width * 20}
                  color={'#000'}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={1}
              onLongPress={drag}
              onPressIn={() => {
                setItemState(state => ({
                  ...state,
                  listIndex: null,
                  setting: false,
                }));
              }}
              delayLongPress={100}
              disabled={isActive}
              style={[
                styles.rowItem,
                {
                  padding: width * 5,
                  justifyContent: 'center',
                  backgroundColor: isActive
                    ? item.backgroundColor
                    : item.backgroundColor,
                  opacity: isActive ? 1 : 0.2,
                },
              ]}>
              <CustomIcon name={'sort'} size={width * 20} color={'#000'} />
            </TouchableOpacity>
          </View>
        </ScaleDecorator>
      </>
    );
  };
  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      console.log('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error.message);
    }
  };
  return (
    <>
      <View style={[styles.body_con]}>
        {/* <Button title="로그아웃" onPress={handleSignOut} /> */}
        <View style={styles.listArea}>
          <View
            style={{
              backgroundColor: '#ddd',
              width: screenWidth,
              paddingHorizontal: width * 20,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {posts.length > 0 && (
              <DraggableFlatList
                style={{width: screenWidth}}
                data={posts.map((item, index) => ({
                  ...item,
                  index,
                }))}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onDragEnd={({data}) => {
                  setPosts(data);
                  updateList(data);
                }}
                contentContainerStyle={{
                  paddingHorizontal: width * 20,
                  paddingVertical: 20,
                }}
              />
            )}
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? statusBarHeight + height * 50 : 0
          }>
          <View>
            {!itemState.setting && (
              <View style={[styles.textInputContainer]}>
                <View style={{flexDirection: 'row'}}>
                  <Animated.View
                    style={[
                      {
                        flex: 1,
                        marginRight: 10,
                      },
                      animatedBorderStyle,
                    ]}>
                    <TextInput
                      value={addTitle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="입력해주세요"
                      style={[styles.textInput]}
                      autoCorrect={false}
                      returnKeyType="done"
                      //   multiline={true} // 여러 줄 입력 활성화
                      onChangeText={textAddHandler}
                      onSubmitEditing={saveToFirestore}
                    />
                  </Animated.View>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'blue',
                      paddingHorizontal: width * 15,
                      backgroundColor: '#007AFF',
                    }}
                    onPress={saveToFirestore}>
                    <Text style={{color: '#FFF', fontSize: width * 12}}>
                      전송
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body_con: {
    flex: 1,
  },

  list_style: {
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list_itme_style: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: height * 10,
    paddingHorizontal: width * 10,
    marginBottom: height * 5,
    marginTop: height * 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  star_btn_style: {
    paddingHorizontal: width * 5,
    paddingVertical: height * 5,
    marginRight: width * 5,
    justifyContent: 'center',
  },
  text_input_style: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 10,
    marginRight: width * 5,
  },
  more_btn_style: {
    paddingHorizontal: width * 5,
    paddingVertical: height * 5,
  },
  rootContainer: {
    flex: 1,
  },
  listArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ababab',
  },
  bg: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 3,
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: height * 20,
    borderTopColor: 'skyblue',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  textInput: {
    width: '100%',
    fontSize: 18,
    height: height * 40,
    paddingHorizontal: width * 8,
    color: '#000',
  },
});
