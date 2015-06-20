/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var stepCount = 1;

var Pedometer = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.largeNotice}>
          {stepCount}
        </Text>
        <Text style={styles.status}>
          You have walked {stepCount} step{stepCount==1?'':'s'} today.
        </Text>
        <Text style={styles.instructions}>
          Just keep your phone in your pocket and go for a walk!
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  largeNotice: {
    fontSize: 70,
    textAlign: 'center',
    margin: 30,
  },
  status: {
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

AppRegistry.registerComponent('Pedometer', () => Pedometer);
