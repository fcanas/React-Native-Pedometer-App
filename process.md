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
stubs are simple. Something that might stand out here is that we're going to
return availability through a callback. That's because, as far as I can tell,
native calls can only return data through a callback, even if the value might be
available immediately. Additionally, the callbacks all return `null` as a first
parameter because it's for returning errors by convention.

```js
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
to be an error. To help illustrate React's power of keeping views up-to-date
with changing data, we'll make our `startPedometerUpdatesFromDate` function call
the handler twice in succession with updated data.

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

  setTimeout(function(){
    handler(null, {
      startDate: date,
      endDate: date,
      numberOfSteps: 30,
      distance: 15,
      floorsAscended: 1,
      floorsDescended: 0,
    });
  }, 5000);
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

### Connecting the Stubs to the App

In our App's main implementation, we need to import our new module:

```js
var CMPedometer = require('./Pedometer');
```

We then update our template to render itself using value from its `state` member
and provide an implementation of `getInitialState` to provide reasonable initial
values.

```js
render: function() {
  return (
    <View style={styles.container}>
      <Text style={styles.largeNotice}>
        {this.state.numberOfSteps}
      </Text>
      <Text style={styles.status}>
        You walked {this.state.numberOfSteps} step{this.state.numberOfSteps==1?'':'s'}.
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
```

Then we want to start fetching updates from our pedometer data when the
component loads. And in our handler, we will update the component's state, which
will in turn re-render our view for us.

```js
componentDidMount: function () {
  this.startUpdates();
},

startUpdates: function () {
  CMPedometer.startPedometerUpdatesFromDate(null, function (error, motionData) {
    console.log("motionData: " + motionData);
    this.setState(motionData);
  }.bind(this));
},
```

### Native Module

Now we can start writing our native module. We do this in Objective-C. React has
put a lot of work into creating preprocessor macros that massage Objective-C
classes into a form that makes them bridge into javascript as well as conform to
React's conventions. While it is likely it is possible to write these components
in Swift -- and Swift may seem appealing to you as JavaScript developers, it's
simply not a good idea to attempt that approach today unless you're already
well-versed in Swift and Objective-C.

We start by making a new `FFCPedometer` class that conforms to `RCTBridgeModule`.

```objc
#import "RCTBridgeModule.h"

@interface FFCPedometer : NSObject <RCTBridgeModule>

@end
```

And we add methods implementing what we need. We export the class as a module,
add availability methods, and a query updating method that uses a callback.
A few notable notable but minor additions beyond those methods. First creating
an keeping a `CMPedometer`, that is, the pedometer object provided by the system
frameworks that we're wrapping. And also a convenience method to convert
`CMPedometerData` into a JSON-compatible dictionary.

One substantial consideration here is that callbacks that are bridged to
Objective-C are only intended to be called once. This lets us use a callback for
the query method, but not for our `start` method.

The approach other areas of React Native take to callbacks that need to be
called more than once is to use a global event dispatcher. In javascript, you
register a function with a string key that gets called with a passed object when
that global signal is triggered:

```js
startPedometerUpdatesFromDate: function(date, handler) {
  FFCPedometer.startPedometerUpdatesFromDate(date);
  listener = RCTDeviceEventEmitter.addListener(
    'pedometerDataDidUpdate',
    handler
  );
},
```

On the Objective-C side, we get a reference to the bridge's event dispatcher and
send a message with the pedometer data across the bridge.

```objc
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface FFCPedometer ()
@property (nonatomic, readonly) CMPedometer *pedometer;
@end

@implementation FFCPedometer

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(isStepCountingAvailable:(RCTResponseSenderBlock) callback) {
  callback(@[NullErr, @([CMPedometer isStepCountingAvailable])]);
}

RCT_EXPORT_METHOD(isFloorCountingAvailable:(RCTResponseSenderBlock) callback) {
  callback(@[NullErr, @([CMPedometer isFloorCountingAvailable])]);
}

RCT_EXPORT_METHOD(isDistanceAvailable:(RCTResponseSenderBlock) callback) {
  callback(@[NullErr, @([CMPedometer isDistanceAvailable])]);
}
RCT_EXPORT_METHOD(queryPedometerDataBetweenDates:(NSDate *)startDate endDate:(NSDate *)endDate handler:(RCTResponseSenderBlock)handler) {
  [self.pedometer queryPedometerDataFromDate:startDate
                                      toDate:endDate
                                 withHandler:^(CMPedometerData *pedometerData, NSError *error) {
                                   handler(@[error.description?:NullErr, [self dictionaryFromPedometerData:pedometerData]]);
                                 }];
}

RCT_EXPORT_METHOD(startPedometerUpdatesFromDate:(NSDate *)date) {
  [self.pedometer startPedometerUpdatesFromDate:date?:[NSDate date]
                                    withHandler:^(CMPedometerData *pedometerData, NSError *error) {
                                      if (pedometerData) {
                                        [[self.bridge eventDispatcher] sendDeviceEventWithName:@"pedometerDataDidUpdate" body:[self dictionaryFromPedometerData:pedometerData]];
                                      }
                                    }];
}

RCT_EXPORT_METHOD(stopPedometerUpdates) {
  [self.pedometer stopPedometerUpdates];
}

#pragma mark - Private

- (NSDictionary *)dictionaryFromPedometerData:(CMPedometerData *)data {

  static NSDateFormatter *formatter;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    formatter = [[NSDateFormatter alloc] init];
    formatter.dateFormat = @"yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ";
    formatter.locale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
    formatter.timeZone = [NSTimeZone timeZoneWithName:@"UTC"];
  });
  return @{

           @"startDate": [formatter stringFromDate:data.startDate]?:NullErr,
           @"endDate": [formatter stringFromDate:data.endDate]?:NullErr,
           @"numberOfSteps": data.numberOfSteps?:NullErr,
           @"distance": data.distance?:NullErr,
           @"floorsAscended": data.floorsAscended?:NullErr,
           @"floorsDescended": data.floorsDescended?:NullErr,
           };
}

- (instancetype)init
{
  self = [super init];
  if (self == nil) {
    return nil;
  }

  _pedometer = [CMPedometer new];

  return self;
}

@end
```

And the full JavaScript module:

```js
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
```
