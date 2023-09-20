import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Platform} from 'react-native';

export default function AppStatusBar() {
  return (
    <>
      <SafeAreaView style={styles.safe} />
      <StatusBar backgroundColor="#000" barStyle={'light-content'} />
    </>
  );
}
const styles = StyleSheet.create({
  safe: {backgroundColor: '#000'},
});
