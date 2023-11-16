import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  NativeModules,
} from 'react-native';
import CustomIcon from '../pages/CustomIcon';
import {height, width} from '../globalStyles';

import API from '../utils/axios';

import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {useSelector} from 'react-redux';
import {Button} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
export function Body() {
  const {StatusBarManager} = NativeModules;
  const store = useSelector(state => state.user);
  const screenWidth = Math.round(Dimensions.get('window').width);
  const navigation = useNavigation();
  const [list, setList] = useState([
    {
      _id: '',
      email: '',
      nickName: '',
      date: '',
      // list: [],
    },
  ]);

  const [btn, setBtn] = useState(true);
  const [addTitle, setAddTitle] = useState('');
  const [title, setTitle] = useState('');
  const [itemState, setItemState] = useState({
    setting: false,
    listIndex: null,
    loading: false,
  });

  useEffect(() => {
    Platform.OS == 'ios'
      ? StatusBarManager.getHeight(statusBarFrameData => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  const [statusBarHeight, setStatusBarHeight] = useState(0);

  //데이터조회
  const getList = useCallback(async () => {
    const res = await API.get(`/api/list?email=${'rudals782@nate.com'}`);
    try {
      if (res.data.length === 0) return setList(state => state);
      setList(res.data);
    } catch (err) {
      setList(state => state);
    }
  }, []);

  //데이터 순서변경
  const updateList = useCallback(
    async data => {
      const post = {
        email: 'rudals782@nate.com',
        list: data,
      };
      setList(state => [{...state, list: data}]);
      const res = await API.post(`/api/list?type=change`, post);

      try {
      } catch (err) {
        setList(state => state);
        console.log(err.response);
      }
    },
    [list],
  );

  const updateItem = useCallback(
    async (index, title, item) => {
      const post = {
        email: 'rudals782@nate.com',
        title,
        content: item.content,
      };

      let copy = list[0];
      copy.list[index].title = title;

      setItemState(state => ({
        ...state,
        listIndex: null,
        setting: false,
      }));

      const res = await API.post(`/api/list?type=edit&idx=${index}`, post);
      try {
        console.log(res.data);
      } catch (err) {
        console.log(err.response);
      }
    },
    [list],
  );
  const addItem = useCallback(async () => {
    if (addTitle === '') return alert('글자를 입력하세요');
    setBtn(true);
    setItemState(state => ({...state, loading: true, listIndex: null}));
    const post = {
      email: 'rudals782@nate.com',
      nickName: '경민',
      list: {title: addTitle, content: ''},
    };
    const res = await API.post(`/api/list?type=add`, post);
    setAddTitle('');
    try {
      setItemState(state => ({...state, loading: false}));
      Keyboard.dismiss();
    } catch (err) {
      console.log(err.response);
    } finally {
      animateToast(1);
      const ok = setTimeout(() => {
        animateToast(0);
      }, 2000);
    }
  }, [itemState, addTitle]);

  const addPush = useCallback(async () => {
    setBtn(true);
    if (addTitle === '') return alert('글자를 입력하세요');
    setItemState(state => ({...state, loading: true, listIndex: null}));
    const post = {
      id: '' || null,
      email: 'rudals782@nate.com',
      title: addTitle,
      content: '',
    };
    Keyboard.dismiss();
    const res = await API.post(`/api/list?type=push`, post);
    setAddTitle('');
    try {
      setItemState(state => ({...state, loading: false}));
    } catch (err) {
      console.log(err.response, '에러');
    } finally {
      animateToast(1);
      const ok = setTimeout(() => {
        animateToast(0);
      }, 2000);
    }
  }, [list, addTitle, btn]);

  const deleteItem = useCallback(
    async id => {
      setBtn(false);
      setItemState(state => ({
        ...state,
        loading: true,
        listIndex: null,
        setting: false,
      }));
      const post = {
        email: 'rudals782@nate.com',
        id,
      };
      const res = await API.post(`/api/list?type=delete`, post);
      try {
        console.log(res.data);
        setItemState(state => ({...state, loading: false}));
      } catch (err) {
        console.log(err.response);
      } finally {
        animateDeleteToast(1);
        const ok = setTimeout(() => {
          animateDeleteToast(0);
        }, 2000);
      }
    },
    [list, btn],
  );

  useEffect(() => {
    // getList();
  }, [itemState.loading]);

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
                      updateItem(index, title, item);
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
                  deleteItem(item.id);
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

  const [borderColorAnimation] = useState(new Animated.Value(0));
  const [toastAnimation] = useState(new Animated.Value(0));
  const [toastDeleteAnimation] = useState(new Animated.Value(0));

  const handleFocus = () => {
    animateBorderColor(1);
    animateToast(0);
  };
  const handleBlur = () => animateBorderColor(0);

  const animateToast = value => {
    Animated.timing(toastAnimation, {
      toValue: value,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  const animateToastStyle = {
    bottom: toastAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 140],
    }),
    opacity: toastAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1],
    }),
    zIndex: toastAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-1, 1],
    }),
  };
  const animateDeleteToast = value => {
    Animated.timing(toastDeleteAnimation, {
      toValue: value,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  const animateDeleteToastStyle = {
    bottom: toastDeleteAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 140],
    }),
    opacity: toastDeleteAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1],
    }),
    zIndex: toastDeleteAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-1, 1],
    }),
  };

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

  const handleSignOut = async () => {
    try {
      const res = await auth().signOut();
      console.log('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error.message);
    }
  };

  return (
    <>
      <View style={[styles.body_con]}>
        <Button title="로그아웃" onPress={handleSignOut} />
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
            {list[0].list !== undefined && (
              <DraggableFlatList
                style={{width: screenWidth}}
                data={list[0].list.map((item, index) => ({
                  ...item,
                  index,
                }))}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onDragEnd={({data}) => {
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
        {btn ? (
          <TouchableWithoutFeedback
            onPress={() => {
              animateToast(0);
            }}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: width * 30,
                  width: screenWidth - width * 60,
                  height: height * 60,
                  backgroundColor: 'skyblue',
                  borderRadius: width * 10,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                animateToastStyle,
              ]}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: width * 14,
                }}>
                추가 되었습니다
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: width * 30,
                  width: screenWidth - width * 60,
                  height: height * 60,
                  backgroundColor: 'pink',
                  borderRadius: width * 10,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                animateDeleteToastStyle,
              ]}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: width * 14,
                }}>
                삭제되었습니다
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

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
                      // multiline={true} // 여러 줄 입력 활성화
                      onChangeText={textAddHandler}
                      onSubmitEditing={
                        list[0].list === undefined ? addItem : addPush
                      }
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
                    onPress={list[0].list === undefined ? addItem : addPush}>
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
