var Pedometer = {
  isStepCountingAvailable: function() {
    return true;
  },
  isDistanceAvailable: function() {
    return true;
  },
  isFloorCountingAvailable: function() {
    return true;
  },

  startPedometerUpdatesFromDate: function(date, handler) {
    handler(null, {
      startDate: date,
      endDate: date,
      numberOfSteps: 12,
      distance: 8,
      floorsAscended: 1,
      floorsDescended: 0,
    });
  },
  stopPedometerUpdates: function () { },

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
