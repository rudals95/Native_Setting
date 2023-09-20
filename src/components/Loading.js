import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {height, width} from '../globalStyles';
import {useSelector} from 'react-redux';
import {Animated} from 'react-native';

function Slide() {
  const animation = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: enabled ? 0 : -5,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setEnabled(!enabled);
    });
    Animated.timing(animation2, {
      toValue: enabled ? -5 : 5,
      useNativeDriver: true,
      duration: 350,
    }).start();
    Animated.timing(animation3, {
      toValue: enabled ? -10 : 10,
      useNativeDriver: true,
      duration: 350,
    }).start();
  }, [animation, animation2, animation3, enabled]);

  return (
    <>
      <View style={{flexDirection: 'row'}}>
        <Animated.View
          style={[
            style.rectangle,
            {transform: [{translateY: animation}], backgroundColor: '#F95163'},
          ]}
        />
        <Animated.View
          style={[
            style.rectangle,
            {transform: [{translateY: animation2}], backgroundColor: '#6C2FF2'},
          ]}
        />
        <Animated.View
          style={[
            style.rectangle,
            {transform: [{translateY: animation3}], backgroundColor: '#FFCC63'},
          ]}
        />
      </View>
    </>
  );
}

export default function Loading() {
  const store = useSelector(state => state.tabBar);

  return (
    <>
      {store.tabBar && (
        <View style={style.loading_con}>
          <View style={style.loading_style}>
            <View
              style={{
                width: width * 80,
              }}>
              <Slide />
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const style = StyleSheet.create({
  loading_con: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
  loading_style: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },

  block: {},
  rectangle: {
    width: width * 15,
    height: width * 15,
    borderRadius: 50,
    marginHorizontal: 5,
  },
});
