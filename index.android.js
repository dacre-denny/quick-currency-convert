/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import { PropTypes } from 'react';
import { requireNativeComponent, NativeModules } from 'react-native';

class OCRViewComponent extends Component {

    constructor(props) {
        super(props);
        this.onTextDetected = this.onTextDetected.bind(this);
    }

    onTextDetected(event) {
      debugger
        if(!this.props.onTextDetected) {
            return;
        }
        this.props.onTextDetected(event.nativeEvent);
    }

    render() {
        return <OCRView {...this.props} onTextDetected={this.onTextDetected} />;
    }
}

OCRViewComponent.propTypes = {

    onTextDetected: PropTypes.func,
    // resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch']),
    ...View.propTypes // include the default view properties
}

const OCRView = requireNativeComponent('OCRView', OCRViewComponent, { nativeOnly : { onChange : true }});

const OCRAndroid = NativeModules.OCRAndroid;

import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  Image,
  View,
  TouchableOpacity 
} from 'react-native';

const CurrencyPanelStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
})

class CurrencyPanel extends Component {

  render() {

    return <View style={{ flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center' }}>
      
      <View style={{ flexDirection : 'column' }}>
        <Image style={ { width : 90, height : 30 }} source={ require('./imgs/usa.png') } />
        <Button title="change"  onPress={ () => {} }/>
      </View>
      <Text style={{ fontSize : 38 }}>$100.00</Text>
    </View>
  }
}

class ScanButton extends Component {

  render() {

    const { isScanning, onPress } = this.props

/* isScanning={isScanning} onPress={ this.toggleScanning() } */
    return <TouchableOpacity style={{ margin : 10, backgroundColor : '#b93422' }} onPress={ () => onPress() }>
      <Text style={{ color : '#ffffff', fontSize : 20, fontFamily : 'sans-serif-medium', textAlign : 'center', padding : 20 }}>
        { isScanning ? 'Stop Scanning' : 'Scan Price' }
      </Text>
      </TouchableOpacity>
  }
}

class EditButton extends Component {

  render() {

    return <TouchableOpacity style={{ backgroundColor : '#991199', padding : 10 }}>
        <Image style={ { width : 20, height : 20 }} source={ require('./imgs/pencil.png') } />
      </TouchableOpacity>
  }
}

class StatusPopover extends Component {

  render() {

    return <View style={{ flexGrow : 1, alignItems : 'flex-start', justifyContent : 'flex-end', backgroundColor : '#001100' }}>
          <Text style={{ backgroundColor : '#ffffff', color: '#28363d', margin : 10, padding : 8, fontSize : 14, borderRadius : 7, borderTopRightRadius : 0 }}>
            Best match $1100.00
          </Text>
        </View>
  }
}

export default class QuickCurrencyConvert extends Component {

    constructor(props) {
        super(props);

        this.state = {

          isScanning : false,
          matches : [],

currentText : ''
        }
    }

    startScanning() {
      this.setState({
        isScanning : true,
        matches : []
      })
    }

    stopScanning() {
      this.setState({
        isScanning : false,
        matches : []
      })
    }

    toggleScanning() {
      
      const { isScanning } = this.state
      
      if(isScanning) {
        this.stopScanning()
      }
      else {
        this.startScanning()
      }
    }

  render() { 

    const { 
      currentText,
      isScanning
     } = this.state

    return (
      <View style={{ flex : 1, flexDirection : 'column', justifyContent : 'flex-start', backgroundColor : '#28363d' }}>
        
        <StatusPopover />

        <View style={{ flexDirection : 'column' }}>
          <View style={{ flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center',  paddingBottom : 10, margin : 10, borderBottomColor : '#4c5961', borderBottomWidth : 1 }}>
            {/*<View style={{ flexDirection : 'row', justifyContent : 'flex-start' }}>
              <Text style={{ color : '#ffffff', fontSize : 16 }}>US Dollars to NZ Dollars</Text> 
            </View>
            <Button color='#cccccc' color='#222222' title='Change' onPress={ () => {} } />*/}

            <Button color='#222222' title='US Dollars' onPress={ () => {} } />
            <Image style={ { width : 30, height : 30 }} source={ require('./imgs/arrow.png') } />
            <Button color='#222222' title='NZ Dollars' onPress={ () => {} } />
              
          </View>
          <View style={{   flexDirection : 'column', justifyContent : 'center', alignItems : 'center',  paddingBottom : 10  }}>
            <Text style={{ fontSize : 42, color : '#ffffff', fontFamily : 'sans-serif-light' }}>$100.00</Text> 
            <Text style={{ fontSize : 16, color : '#a2b0b8', fontFamily : 'sans-serif' }}>New Zealand Dollars</Text> 
          </View>
        </View>
          <ScanButton isScanning={isScanning} onPress={ () => this.toggleScanning() } />

        {/*
        <OCRView style={{ width : 150, height : 150, borderWidth: 5, borderColor: '#101111'  }} onTextDetected={ text => {
           
          this.setState({ currentText : text.nativeEvent.text  })
          } }  />
          */}
          

 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bigButton: {
    padding: 15
  }
});

AppRegistry.registerComponent('QuickCurrencyConvert', () => QuickCurrencyConvert);
