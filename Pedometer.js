var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var FFCPedometer = require('NativeModules').FFCPedometer;

var Pedometer = {
  isStepCountingAvailable: function(callback) {
    FFCPedometer.isStepCountingAvailable(callback);
  },
  isDistanceAvailable: function(callback) {
    FFCPedometer.isDistanceAvailable(callback);
  },
  isFloorCountingAvailable: function(callback) {
    FFCPedometer.isFloorCountingAvailable(callback);
  },

  startPedometerUpdatesFromDate: function(date, handler) {
    FFCPedometer.startPedometerUpdatesFromDate(date);
    RCTDeviceEventEmitter.addListener(
      'pedometerDataDidUpdate',
      handler
    );
  },
  stopPedometerUpdates: function () {
    FFCPedometer.stopPedometerUpdates();
  },

  queryPedometerDataBetweenDates: function(startDate, endDate, handler) {
    FFCPedometer.queryPedometerDataBetweenDates(startDate, endDate, handler);
  },
};

module.exports = Pedometer;
