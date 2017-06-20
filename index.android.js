/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import { PropTypes } from 'react';
import { requireNativeComponent, NativeModules } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';


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
  TouchableOpacity,
  FlatList
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

class CurrencyButton extends Component {

  render() {

    const { currency, onPress } = this.props
    const label = (currency.label || 'Unset').toUpperCase()

    return <TouchableOpacity style={{ backgroundColor : '#222222', padding : 7, borderRadius : 2, flexDirection : 'row' }} onPress={ () => onPress() }>
        <Text style={{ color : '#ffffff', fontWeight : 'bold' }} title='US Dollars' onPress={ () => navigate('CurrencyPicker', { name: 'Jane' }) } >{ label }</Text>
        <Image style={{ marginLeft : 10, width : 18, height : 18 }} source={ require('./imgs/pencil.png') } />
      </TouchableOpacity>
  }
}

class State {

    getCurrencies() {
try {
      var currencies = AsyncStorage.getItem('currencies')

      if(!currencies) {

        currencies = [    
          {
            code : 'USD',
            symbol : '$',
            label : 'US Dollars',
            display : 'United States Dollars'
          }, {
            code :'GBP',
            symbol : '£',
            label : 'Pound',
            display : 'British Pound'
          }, {
            code : 'NZD',
            symbol : '$',
            label : 'NZ Dollars',
            display : 'New Zealand Dollars'
          }, {
            code : 'CAD',
            symbol : '$',
            label : 'Canadian Dollars',
            display : 'Canadian Dollars'
          }, {
            code : 'AUD',
            symbol : '$',
            label : 'Australian Dollars',
            display : 'Australian Dollars'
          }, {
            code : 'CNY',
            symbol : '¥',
            label : 'Chinese Yuan',
            display : 'Chinese Yuan'
          }
        ]
  
        AsyncStorage.setItem('currencies', currencies)
      }
      
      return currencies
    } catch(exception) {
  
}
    }

    fetchCurrencies() {

      const currencies = getCurrencies()

      return fetch('http://api.fixer.io/latest?base=USD&symbols=' + currencies.map(currency => currency.code).join(','))
      .then(response => response.ok ? response.json() : Promise.reject('Error getting exchange rates'))
      .then(json => {

        currencies.forEach(currency => {
          
          const rate = parseFloat(json.rates[currency.code])

          if(!isNaN(rate)) {
            currency.rate = rate.toFixed(2)
          }
        })        

        AsyncStorage.setItem('currencies', currencies)
      })
    }

    getByCode(code) {

//        const currencies = await AsyncStorage.getItem('currencies')
    }
}

export default class QuickCurrencyConvert extends Component {

    constructor(props) {
        super(props);

        this.state = {

          isScanning : false,
          bestMatch : 0,
          scanMatches : [],

          from : '',
          to : '',

          currencies : [            
            {
              id : 0,
              label : 'US Dollars',
              display : 'United States Dollars',
              symbol : '$',
              rate : 1.00
            },
            {
              id : 1,
              label : 'NZ Dollars',
              display : 'New Zealand Dollars',
              symbol : '$',
              rate : 1.33
            }
          ]
        }

        this.state.from = this.state.currencies[0]
        this.state.to = this.state.currencies[1]
    }

    addMatches(matches) {

      if(!matches) return

      const { isScanning, scanMatches } = this.state
      if(!isScanning) return

      const mapMatches = {}

      scanMatches.forEach(m => {
        mapMatches[ m.value ] = m
      })

      matches
      .map(value => value.replace(/o/gi, '0'))
      .map(value => value.replace(/i/gi, '1'))
      .map(value => value.replace(/s/gi, '5'))
      .map(value => value.replace(/z/gi, '2'))
      .map(value => value.replace(/G/g, '6'))
      .map(value => value.replace(/B/g, '3'))
      .map(value => value.replace(/A/g, '4'))
      .map(value => parseFloat(value))
      .filter(value => !isNaN(value))
      .map(value => value.toFixed(2))
      .forEach(value => {
        console.log('val:',value,'float:', parseFloat(value),'isNan:', isNaN(parseFloat(value)))
        const mapMatch = mapMatches[value]

        if(mapMatch) {

          mapMatch.freq ++;
        }
        else {

          mapMatches[value] = { freq : 1, value : value }
        }
      })      

      scanMatches.length = 0

      for(var value in mapMatches) {

        scanMatches.push(mapMatches[value])
      }

      const bestMatch = scanMatches.reduce((p, v) => p.freq > v.freq ? p : v, { freq : 0, value : 0 }).value

      this.setState({ scanMatches, bestMatch })
      //if(/^\$*\d|.+$/gi.test('$1.23')) return 
    }

    startScanning() {
      this.setState({
        isScanning : true,
        bestMatch : 0,
        scanMatches : []
      })
    }

    stopScanning() {
      this.setState({
        isScanning : false
      })
    }

    convertCurrency(amount) {
      
      const { from, to } = this.state

      if(!from || !to) return '-';

      return to.symbol + ((amount / from.rate) * to.rate).toFixed(2)
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

    const { navigation : { navigate } } = this.props

    const { 
      currentText,
      isScanning,
      bestMatch,
      scanMatches,
      from,
      from : {
        symbol
      },
      to,
      to : {
        display
      }

     } = this.state

     //const bestMatch = scanMatches.reduce((p, v) => p.freq > v.freq, { freq : 0, match : 0 })
     const conversion = this.convertCurrency(bestMatch)
     
    return (
      <View style={{ flex : 1, flexDirection : 'column', justifyContent : 'flex-start', backgroundColor : '#28363d' }}>

        <View style={{ flexGrow : 1, alignItems : 'flex-start', justifyContent : 'flex-end', backgroundColor : '#001100' }}>
           <OCRView style={{alignSelf: 'stretch' , flex : 1 }} onTextDetected={ event => this.addMatches(event.nativeEvent.matches) } />
          {
            isScanning && <Text style={{ position : 'absolute', bottom : 10, left : 10, backgroundColor : '#ffffff', color: '#28363d', padding : 8, fontSize : 14, borderRadius : 7, borderTopRightRadius : 0 }}>
            { (!!bestMatch) ? `Found ${(symbol + bestMatch)}` : `Looking for price tag..` }
          </Text>
          }
        </View>        

        <View style={{ flexDirection : 'column' }}>
          <View style={{ flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center',  paddingBottom : 10, margin : 10, borderBottomColor : '#4c5961', borderBottomWidth : 1 }}>
            
            <Button color='#222222' title='US Dollars' onPress={ () => navigate('CurrencyPicker', { name: 'Jane' }) } />
              {/*<CurrencyButton currency={from} onPress={ () => navigate('CurrencyPicker', { name: 'Jane' }) } />*/}
            <Image style={ { width : 30, height : 30 }} source={ require('./imgs/arrow.png') } />
            {/*<CurrencyButton currency={to} onPress={ () => navigate('CurrencyPicker', { name: 'Jane' }) } />*/}
            <Button color='#222222' title='NZ Dollars' onPress={ () => {} } />
              
          </View>
          <View style={{   flexDirection : 'column', justifyContent : 'center', alignItems : 'center',  paddingBottom : 10  }}>
            <Text style={{ fontSize : 42, color : '#ffffff', fontFamily : 'sans-serif-light' }}>{ conversion }</Text> 
            <Text style={{ fontSize : 16, color : '#a2b0b8', fontFamily : 'sans-serif' }}>{ display }</Text> 
          </View>
        </View>
          <ScanButton isScanning={isScanning} onPress={ () => this.toggleScanning() } />
         <View style={{ flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center', padding : 10, paddingTop : 0 }}>
            
            <Text style={{ fontSize : 14, color : '#a2b0b8', fontFamily : 'sans-serif-light' }}>Currencies updated yesterday</Text> 
            <Button color='#28363d' title='Refresh' onPress={ () => navigate('CurrencyPicker', { name: 'Jane' }) } />
              
          </View>

 
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

class CurrencyPickerScreen extends Component {
    
  render() {
    const { navigate } = this.props.navigation;
    
    return <View style={{ flex : 1, flexDirection : 'column' }}>
      <Text>Select source currency</Text>
      <FlatList data={[
      1,2,3,4,5,
      6,7,8,9,10
    ]} 
    renderItem={ ({item}) => <Text key={item} style={{ fontSize : 45 }}>{ item }</Text> } />
    </View>
  }
}
const App = StackNavigator({
  Home: { screen: QuickCurrencyConvert },
  CurrencyPicker: { screen: CurrencyPickerScreen },
}, {
  headerMode : 'none'
});

AppRegistry.registerComponent('QuickCurrencyConvert', () => App);
