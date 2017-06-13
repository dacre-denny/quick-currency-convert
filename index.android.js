/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import { PropTypes } from 'react';
import { requireNativeComponent, NativeModules } from 'react-native';

var iface = {
  name: 'OCRView',
  propTypes: {
    // src: PropTypes.string,
    borderRadius: PropTypes.number,
    // resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch']),
    ...View.propTypes // include the default view properties
  },
};

const OCRView = requireNativeComponent('OCRView', iface);

const OCRAndroid = NativeModules.OCRAndroid;

import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View
} from 'react-native';

export default class QuickCurrencyConvert extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={ () => { debugger; NativeModules.OCRAndroid.start('dacre',1000) } } title='Toast'/>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <OCRView style={{ width : 150, height : 150, borderWidth: 5, borderColor: '#101111'  }}  />
        <Text style={styles.instructions}>
          To get started, edxit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap Rx on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menuxx
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('QuickCurrencyConvert', () => QuickCurrencyConvert);
