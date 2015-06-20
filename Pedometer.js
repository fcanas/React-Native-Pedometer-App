var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var FFCPedometer = require('NativeModules').FFCPedometer;

var listener;

var Pedometer = {
  isStepCountingAvailable: function(callback) {
    callback(null, true);
  },
  isDistanceAvailable: function(callback) {
    callback(null, true);
  },
  isFloorCountingAvailable: function(callback) {
    callback(null, true);
  },

  startPedometerUpdatesFromDate: function(date, handler) {
    FFCPedometer.startPedometerUpdatesFromDate(date);
    listener = RCTDeviceEventEmitter.addListener(
      'pedometerDataDidUpdate',
      handler
    );
  },
  stopPedometerUpdates: function () {
    FFCPedometer.stopPedometerUpdates();
    listener = null;
  },

  queryPedometerDataBetweenDates: function(startDate, endDate, handler) {
    handler(null, {
      'startDate': startDate,
      'endDate': endDate,
      numberOfSteps: 12,
      distance: 8,
      floorsAscended: 1,
      floorsDescended: 0,
    });
  },
};

module.exports = Pedometer;
