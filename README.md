# tart-revocable

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/tart-revocable.png)](http://npmjs.org/package/tart-revocable)

Implementation of a revocable proxy for [Tiny Actor Run-Time in JavaScript](https://github.com/organix/tartjs).

## Contributors

[@dalnefre](https://github.com/dalnefre), [@tristanls](https://github.com/tristanls)

## Overview

An implementation of a revocable proxy.

  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
  * [Sources](#sources)

## Usage

To run the below example run:

    npm run readme

```javascript
var revocable = require('tart-revocable'),
    tart = require('tart');

var sponsor = tart.sponsor();

var actorBeh = function actorBeh(message) {
    console.log(message);
};

var actor = sponsor(actorBeh);

var capabilities = revocable.proxy(sponsor, actor);

var proxy = capabilities.proxy;
proxy('hello');
proxy('revocable');
proxy('world');

var revoke = capabilities.revoke;
var ackCustomer = sponsor(function ackCustomerBeh() {
    console.log('revoke acked');
});
revoke(ackCustomer);

proxy('this');
proxy('does not get through');
```

## Tests

    npm test

## Documentation

**Public API**

  * [revocable.proxy(sponsor, actor)](#revocableproxysponsor-actor)

### revocable.proxy(sponsor, actor)

  * `sponsor`: _Sponsor_ `function (behavior) {}` Sponsor for actor creation.
  * `actor`: _Actor_ `function (message) {}` Actor to create a revocable proxy for.
  * Return: _Object_ An object containing a revocable proxy and a revoke capability for that proxy.
    * `proxy`: _Actor_ `function (message) {}` Actor that will forward all messages to the `actor` it is a proxy for.
    * `revoke`: _Actor_ `function (customer) {}` Actor that upon receipt of a message will revoke the `proxy`.
      * `customer`: _Actor_ `function () {}` An ack will be sent to the `customer` upon revocation.

## Sources

  * [Tiny Actor Run-Time (JavaScript)](https://github.com/organix/tartjs)