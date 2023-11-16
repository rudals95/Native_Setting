import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import CustomIcon from '../pages/CustomIcon';
import {height, width} from '../globalStyles';

export function Head({iconData, action, title}) {
  return (
    <View style={styles.head_con}>
      <TouchableOpacity style={styles.top_btn_style} onPress={action}>
        <CustomIcon
          name={iconData.name}
          size={width * iconData.size}
          color={iconData.color}
        />
      </TouchableOpacity>
      <Text
        style={[
          {
            fontSize: width * 20,
            fontWeight: '700',
            color: '#000',
          },
        ]}>
        {title}
      </Text>
      <TouchableOpacity style={styles.top_btn_style}>
        <CustomIcon name={'more-vertical'} size={width * 25} color={'#000'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  head_con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: height * 50,
  },
  top_btn_style: {
    width: width * 50,
    alignItems: 'center',
    // paddingVertical: height * 10,
  },
});
