## [fit]Writing Native Modules for
# [fit]React Native

---

![original 60%](https://mojotech-static.s3.amazonaws.com/m4/toolkit/images/brand/logos/mojo_full_logo_green.png)

^ Welcome to MojoTech. I work here as a native iOS developer.

---

^ which means I spend my time writing Swift and Objective-C, not JavaScript.

![left 100%](https://developer.apple.com/assets/elements/icons/128x128/swift_2x.png)

# `[Objective-C]`

---

## [fit]Writing Native Modules for
# [fit]React Native

^ Today's talk is about ...
^ which means I think we need to go over a little context to undersand ::::

---

^ first _React_

## [fit]~~Writing Native Modules for~~
# [fit]**React** Native

---

^ Then _React Native_

## [fit]~~Writing Native Modules for~~
# [fit]**React Native**

---

## [fit]**Writing Native Modules for**
# [fit]**React Native**

^ before diving into native modules, what they are, why you'd want them, and how to make them.

---

<!-- ![left](https://raw.githubusercontent.com/fcanas/React-Native-Pedometer/presentation/Presentation/images/reacg-bg-fill.png) -->

![fill](https://raw.githubusercontent.com/fcanas/React-Native-Pedometer/presentation/Presentation/images/react.png)

# React

^ React is a JavaScript UI library introduced by Facebook --

* JavaScript UI Library
* Simplify Apps where data changes over time
* Declarative & Composable

---

<!-- ![left](https://raw.githubusercontent.com/fcanas/React-Native-Pedometer/presentation/Presentation/images/reacg-bg-fill.png) -->

![fill](https://raw.githubusercontent.com/fcanas/React-Native-Pedometer/presentation/Presentation/images/react.png)

# React

* Define UI in terms of some state
* Update your state
* UI "reacts" and shows updated state

^ It's a lot like bindings with maybe some philosophical differences on how you approach writing the app.

^ I think it's a pretty cool way to organize and write front-ends, and I've been trying to apply similar patterns for years outside the javascript world.

---

# React

^ Let's take a brief look at a web example from Facebook.
^ we make a component called "HelloWorld" and define its content in terms of its properties

^ then elsewhere in the app, probably not in a `setInterval`, we set the data on the object and render it into the document.

Web Example: [^1]



```js
var HelloWorld = React.createClass({
  render: function() {
    return (
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
        It is {this.props.date.toTimeString()}
      </p>
    );
  }
});

setInterval(function() {
  React.render(
    <HelloWorld date={new Date()} />,
    document.getElementById('example')
  );
}, 500);
```

[^1]: http://facebook.github.io/react/docs/displaying-data.html

---

# React

>  It uses a fast, internal mock DOM to perform diffs and computes the most efficient DOM mutation for you [^2]

^ Why does this matter?
^ Because you can write your components in the smallest, most focused way possible
^ and ignore all the state that doesn't matter to them

^ It's not unlike really simplified bindings.

^ ..so when de data shows up in your component, it updates quickly with minimal DOM changes, without having to think too hard about it.
^ You're not doing a series of queries for each element that changes.
^ you can keep things modular, and changes get applied together at the appropriate time.

```html
<p>
  Hello, <input type="text" placeholder="Your name here" />!
  It is {this.props.date.toTimeString()}
</p>
```

[^2]: http://facebook.github.io/react/docs/displaying-data.html

---

^ I'm not necessarily advocating you use React. Facebook is. It's working well for them. The most interesting thing to me about React is that Facebook developed some tooling called React Native.

^ next:::
#### That's cool. What's

# [fit]React Native

---

^ React native lets you write react and run it on iOS.

# React Native

## Write React, run on iOS


^ Android is coming in 2 months : http://www.reactnativeandroid.com

---

## React Native

# [fit]~~Web Apps on iOS~~

^ It's not web apps running on device. It's not a web view.
^ It's not even React Web code. You can't take a React app and just run it on iOS.

---

## React Native

# [fit]Write JavaScript
## JSX tags `=>` Native components
# [fit]Fully Native UI

^ <---Read slide

^ and that javascript you write is in the React style and structure.

---

# [fit]Why?

---

# Why?

* Facebook has a lot of JS engineers
* "Learn once, write anywhere"
* It's a pretty good architecture that encourages non-buggy code

---

# [fit]How?

---

^ When you write a React app, you're really just a JavaScript app running over here on the left poking changes into a virtual DOM.

^ There's some great tools and conventions over there.

^ then there's this powerful diffing engine that finds changes in the virtual DOM

^ and those get coalesced and applied to the real DOM

# React

```js
fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource:
          this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
        });
      })
      .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
      />
    );
  },
```

![right  fit](https://raw.githubusercontent.com/fcanas/React-Native-Pedometer/master/Presentation/images/dom-diff.png)

---

# React Native

^ In React Native, we just replace the DOM with a view hierarchy. we keep the JavaScript
 we keep the great conventions and tooling.
 we keep the virtual DOM diffing engine
 And Facebook just writes a way to apply that to a hierarchy of native views.

```js
fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource:
          this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
        });
      })
      .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
      />
    );
  },
```

![right fit](https://raw.githubusercontent.com/fcanas/React-Native-Pedometer/master/Presentation/images/view-diff.png)

---

# [fit]JavaScriptCore

![left fit](https://raw.githubusercontent.com/fcanas/React-Native-Pedometer/presentation/Presentation/images/framework.png)

## WebKit's JS Engine

^ What's happening is that your 'JS' app is not running in a WebKit view.
^ It's running in JavascriptCore
^ It's kind of like node in that regard, but it's not node
^ Apple shipped this a couple of years ago and has been improving bridging between JS and native code for a while now.

---

^ So Swift and Objective-C are done right?

# [fit] Swift & `[Objective-C]`
# [fit]:fire:

----

^ Not so fast. We need to acknowledge that a lot of React Native is built with native components.
We are using native views after all. But we're also given access to the network, hardware, etc. And just like in a browser, those things are written natively.

# Built-In Native Modules

^ React comes with a bunch of native modules that let you get at the system's Functionality

* Geolocation
* Vibration
* Action Sheets
* Networking
* Images
* Settings Bundles
* Alerts ...

^ Everything that happens after the "DOM-Diff" is going to be native.

---

^ So let's say we want to write a pedometer app. A step counter.

# Pedometer

^ Every iPhone after the iPhone 5s has the hardware capability to collect motion data in the background in a low-power mode, and deliver it periodically. There's even high-level APIs to get at this and other fitness-related motion data.

---

^ and that's a native API. One that's trivial to access in Swift or Objective-C but facebook didn't have the good grace to bridge into React.

^ So we're going to write a native module so we can access these APIs in a React app

# Native API : **`CMPedometer`**

### Unavailable in React Native

# _

# [fit]:frowning:

---
# Native API : **`CMPedometer`**

## Determining Pedometer Availability
* `+ isStepCountingAvailable`
* `+ isDistanceAvailable`
* `+ isFloorCountingAvailable`

---
# Native API : **`CMPedometer`**

## Generating Live Pedometer Data
* `- startPedometerUpdatesFromDate:withHandler:`
* `- stopPedometerUpdates`

---
# Native API : **`CMPedometer`**

## Fetching Historical Pedometer Data
* `-queryPedometerDataFromDate:toDate:withHandler:`

^ You're about to see some JavaScript I wrote...

^ Please forgive me: I don't write JS. The result of this exercise is published on GitHub, and as I package it up for release as a Native Module, I hope to get pull requests fixing my atrocious JS.

^ And hopefully as I get further into writing React Native apps, I'll pick up on the conventions and write more beautiful JS.

---

^ I'm going to start by making stubs for the JavaScript interface we want to be able to use in the app.


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

---

^ the start updating function

^ and the stop function can be empty for now.

```js
startPedometerUpdatesFromDate: function(date, handler) {
  handler({
    startDate: date,
    endDate: date,
    numberOfSteps: 12,
    distance: 8,
    floorsAscended: 1,
    floorsDescended: 0,
  });
},
stopPedometerUpdates: function () { },
```

---

^ and we'll throw in the query function for completeness

```js
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

---

# React

^So we write our react Component

```js
var Pedometer = require('./Pedometer');

var PedometerApp = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.largeNotice}>
          {this.state.numberOfSteps}
        </Text>
        <Text style={styles.status}>
          You walked {this.state.numberOfSteps}
          step{this.state.numberOfSteps==1?'':'s'},
          or about {this.state.distance} meters.
          </Text>
          <Text style={styles.status}>
          You went up {this.state.floorsAscended}
          floor{this.state.floorsAscended==1?'':'s'},
          and down {this.state.floorsDescended}.
        </Text>
        <Text style={styles.instructions}>
          Just keep your phone in your pocket and go for a walk!
        </Text>
      </View>
    );
  },
```
...

![right 50%](https://raw.githubusercontent.com/fcanas/React-Native-Pedometer/presentation/Presentation/images/pedometer-0.png)


---

^ with a couple of initialization pieces, and we kick off the pedometer when the component mounts.

```js
componentDidMount: function () {
  var today = new Date();
  today.setHours(0,0,0,0);

  Pedometer.startPedometerUpdatesFromDate(today, function(motionData){
    console.log("motionData: " + motionData);
    this.setState(motionData);
  }.bind(this));
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

---

^ So all we've done is write a JS API shaped like what we want - and shaped like the native api.

^ It runs in the JS context right along side our JS app.  

### It runs.
### Great.
# [fit]Let's Talk About Bridges

---

# React Bridge

* Built on Apple's Objective-C JavaScript Bridge
* Converts between JavaScript objects and Objective-C constructions:
  * `NSDictionary`
  * `NSArray`
  * `NSString`, `NSNumber`, etc.
  * Blocks (closures)

^ <- go over slide
^ Bridging between JS and objc can be a bit restrictive.
^ Functions have to be annotated right, callbacks have to be handled a certain way.
^ While we're going to see that we can call some objective-c in javascript directly,
^ Keeping this JS "neutral ground" is a great place to flexibly reshape the API to look how we want. It's also a pattern that Facebook adopts in their own native modules.

---

# Bridging in Objective-C

* Define our class
* Export our class as a module

```objc
#import "RCTBridgeModule.h"

@interface FFCPedometer : NSObject <RCTBridgeModule>

@end

// Implementation

@implementation FFCPedometer

RCT_EXPORT_MODULE()
```

---

# Bridging in Objective-C

* Export methods we want to be made available.

^ we can take a look at a simple one:


```c
RCT_EXPORT_METHOD(isStepCountingAvailable:(RCTResponseSenderBlock) callback) {
  callback(@[NullErr, @([CMPedometer isStepCountingAvailable])]);
}
```

becomes

```objc
- (void)isStepCountingAvailable:(RCTResponseSenderBlock) callback {
  callback(@[NullErr, @([CMPedometer isStepCountingAvailable])]);
}
```

---


```objc
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
```



---

# Continuous Updates

* Callbacks: only intended to be called once

* Use `RCTBridge` as a message bus

^ So instead of taking a callback, this method just takes the start date, and we use a named bus to send updates over.

---

```objc
RCT_EXPORT_METHOD(startPedometerUpdatesFromDate:(NSDate *)date) {
  [self.pedometer startPedometerUpdatesFromDate:date?:[NSDate date]
                                    withHandler:^(CMPedometerData *pedometerData, NSError *error) {
                                      if (pedometerData) {
                                        [[self.bridge eventDispatcher]
                                        sendDeviceEventWithName:@"pedometerDataDidUpdate"
                                                           body:[self dictionaryFromPedometerData:pedometerData]];
                                      }
                                    }];
}

RCT_EXPORT_METHOD(stopPedometerUpdates) {
  [self.pedometer stopPedometerUpdates];
}
```

---

Convert CMPedometerData ObjC object to a Bridgeable structure.

```objc
- (NSDictionary *)dictionaryFromPedometerData:(CMPedometerData *)data {
  return @{@"startDate": data.startDate?:NullErr,
           @"endDate": data.endDate?:NullErr,
           @"numberOfSteps": data.numberOfSteps?:NullErr,
           @"distance": data.distance?:NullErr,
           @"floorsAscended": data.floorsAscended?:NullErr,
           @"floorsDescended": data.floorsDescended?:NullErr,
           };
}
```

---

^ getting back to JavaScript

# Back to JS

^ availability APIs are simple, and the query api is also simple

```js
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var FFCPedometer = require('NativeModules').FFCPedometer;

isStepCountingAvailable: function(callback) {
  FFCPedometer.isStepCountingAvailable(callback);
},
isDistanceAvailable: function(callback) {
  FFCPedometer.isDistanceAvailable(callback);
},
isFloorCountingAvailable: function(callback) {
  FFCPedometer.isFloorCountingAvailable(callback);
},
queryPedometerDataBetweenDates: function(startDate, endDate, handler) {
  FFCPedometer.queryPedometerDataBetweenDates(startDate, endDate, handler);
},
```

---

# Back to JS

^ Remember how we used `RCTBridge` as a bus to send events back to JS for our updating API

^ Now, in JS we get to catch them and call the handler.

```js
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
```

^ This isn't ideal :: named message with date...

^ but as i mentioned before, we have this space inside the `Pedometer.js` in the native component to massage the API into what we might want it to be.

---

# Why Native Modules

^ hardware : pedometer

^ hybrid : React seems like it'd be great for a dashboard, but maybe nothing else really warrants a reactive approach.

* Access to hardware
* Access to 1000s of libraries built for iOS
* Integration with legacy code
* Write a hybrid app
* Perfomance
* Custom Drawing[^*]

[^*]: Disclaimer: Views are different

---

# [fit]?


### @fcanas — https://github.com/fcanas/React-Native-Pedometer
