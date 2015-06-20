Install React Native according to Facebook's instructions, and make a new project.

`react-native init Pedometer` creates a new React Native project.

React Native gives you a live programming environment when you run the generated
Xcode project. Run the project, and the applicaiton will run. Command-R will
reload your application from source.

Conceptually, this app is going to start very simply. I think we just need a
step count right in the middle of the screen. Maybe a little instruction, or
labeling might be in order. So We'll edit the screen's JSX and styles to roughly
fit that vision.

## Pedometer Functionality

We're going to use a native API to get at the user's pedometer data collected by
the device. To start, we should take a look at what pedometer information from
the device looks like. From there we'll make a stub javascript interface that
bridges that data over, and make sure to structure it in a way we think makes
sense on the javascript side. Then we'll write the bridge and handle any
impedance mismatches.

### Native API

iOS 8 exposes a `CMPedometer` class that is exactly what we want. (The "CM"
stands for core motion -- in Objective-C we don't have modules or namespaces, so
libraries use letter prefixes to prevent overloading names).

The pedometer provides three kinds of data and methods for determining the
availability of each.


* Determining Pedometer Availability
  * `+ isStepCountingAvailable`
  * `+ isDistanceAvailable`
  * `+ isFloorCountingAvailable`


It has functions for starting and stopping live pedometer data, which is
returned via a callback.

* Generating Live Pedometer Data
  * `- startPedometerUpdatesFromDate:withHandler:`
  * `- stopPedometerUpdates`

And it provides a way to query pedometer data for a specific date range. That
also takes a completion handler of the same form as the live data callback.

* Fetching Historical Pedometer Data
  * `- queryPedometerDataFromDate:toDate:withHandler:`

### JS Stub

We'll start by making a `Pedometer.js` with a root `Pedometer` object that we
export as a module. And we'll add some of the method stubs. The availability
stubs are simple.

```js
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
  stopPedometerUpdates: function () { },
};

module.exports = Pedometer;
```

The functions that accept callbacks require a little more attention. We would
like for the stubs to provide some reasonable behavior. While it's reasonable
for the callbacks to never be called at all, we also want to explore what our
API is going to look like, and how it will be used. So we should call the
handlers with some reasonable data. We can look back at the CoreLocation
documentation and see that we have some fields available in a `CMPedometerData`
model class:

* Getting the Dates
  * startDate
  * endDate
* Getting the Pedestrian Data
  * numberOfSteps
  * distance
* Getting the Floor Counts
  * floorsAscended
  * floorsDescended

So we can fill out those functions to call the handler with sample data. We are
also going to use React's convention, adopted from node, for the first parameter
to be an error.

```js
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
```
