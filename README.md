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
"use strict";

var revocable = require('../index.js'),
    tart = require('tart');

var sponsor = tart.minimal();

var actorBeh = function actorBeh(message) {
    console.log(message);
};

var actor = sponsor(actorBeh);

var capabilities = revocable.proxy(actor);

var proxy = sponsor(capabilities.proxyBeh);
var revoke = sponsor(capabilities.revokeBeh);

var ackCustomer = sponsor(function ackCustomerBeh() {
    console.log('revoke acked');
    stepper();
});

var steps = [
    function step_0 () {
        console.log('step 0');
        proxy('hello');
        proxy('revocable');
        proxy('world');
        this.behavior = steps[1];
        stepper();  //this.self();
    },
    function step_1 () {
        console.log('step 1');
        revoke(ackCustomer);
        this.behavior = steps[2];
    },
    function step_2 () {
        console.log('step 2');
        proxy('these do not');
        proxy('get through');
        this.behavior = steps[3];
    },
    function step_3 () {
        console.log('step 3!');
        throw new Error('Should not reach step 3');
    }
];
var stepper = sponsor(steps[0]);
stepper();

```

## Tests

    npm test

## Documentation

**Public API**

  * [revocable.proxy(actor)](#revocableproxyactor)

### revocable.proxy(actor)

  * `actor`: _Actor_ `function (message) {}` Actor to create a revocable proxies for.
  * Return: _Object_ An object containing behaviors for revocable proxies and a revoke capabilities for the proxies.
    * `proxyBeh`: _Actor_ `function (message) {}` Actor behavior that will forward all messages to the `actor` it is a proxy for.
    * `revokeBeh`: _Actor_ `function (customer) {}` Actor behavior that upon receipt of a message will revoke all proxies for the `actor`.
      * `customer`: _Actor_ `function () {}` An ack will be sent to the `customer` upon revocation.

## Sources

  * [Tiny Actor Run-Time (JavaScript)](https://github.com/organix/tartjs)