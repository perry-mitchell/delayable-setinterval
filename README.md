# Delayable setInterval
> An asynchronous setInterval that can be delayed using promises

![build status](https://github.com/perry-mitchell/delayable-setinterval/actions/workflows/test.yml/badge.svg)

## About

JavaScript's `setInterval` works in a synchronous manner which is non-ideal for handling Promises or asynchronous methods. `setDelayedInterval` matches `setInterval`'s functionality besides the handling of _thenable_ return values.

If a callback of `setDelayedInterval` returns a `Promise`, the interval timer is delayed by the execution of that promise.

![Delayable setInterval timing example](example.jpg)

The timer, if not presented with asynchronous results from callbacks, will execute at expected intervals. Upon receiving a promise the starting of the next interval timer will be delayed as shown above.

## Usage

Usage is much the same as `setInterval`:

```javascript
const { clearDelayedInterval, setDelayedInterval } = require("delayable-setinterval");

const interval = setDelayedInterval(async () => {
    await someAsyncTask();
}, 1000);

// Later
clearDelayedInterval(interval);
```

The example above uses an `async` method to perform some asynchronous tasks. The method is fired every `1000`ms, but is delayed between initialisations of the timer by the time it takes to complete the async callback.

## Support

This library supports NodeJS 12+.
