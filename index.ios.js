/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
(function() {
  'use strict';

  var React = require('react-native');
  var CMPedometer = require('./Pedometer');

  var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
  } = React;

  var Pedometer = React.createClass({
    render: function() {
      return (
        <View style={styles.container}>
          <Text style={styles.largeNotice}>
            {this.state.numberOfSteps}
          </Text>
          <Text style={styles.status}>
            You walked {this.state.numberOfSteps} step{this.state.numberOfSteps==1?'':'s'}, or about {this.state.distance} meters.
            </Text>
            <Text style={styles.status}>
            You went up {this.state.floorsAscended} floor{this.state.floorsAscended==1?'':'s'}, and down {this.state.floorsDescended}.
          </Text>
          <Text style={styles.instructions}>
            Just keep your phone in your pocket and go for a walk!
          </Text>
        </View>
      );
    },

    getInitialState: function () {
      return {
        startDate: null,
        endDate: null,
        numberOfSteps: 0,
        distance: 0,
        floorsAscended: 0,
        floorsDescended: 0,
      }
    },

    componentDidMount: function () {
      this.startUpdates();
    },

    startUpdates: function () {
      var today = new Date();
      today.setHours(0,0,0,0);

      CMPedometer.startPedometerUpdatesFromDate(today, function (motionData) {
        console.log("motionData: " + motionData);
        this.setState(motionData);
      }.bind(this));
    },

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
      marginTop: 15,
      marginBottom: 5,
    },
  });

  AppRegistry.registerComponent('Pedometer', () => Pedometer);
})();

