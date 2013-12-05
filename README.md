# tart-revocable

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/tart-revocable.png)](http://npmjs.org/package/tart-revocable)

Implementation of a revocable reference for [Tiny Actor Run-Time in JavaScript](https://github.com/organix/tartjs).

## Contributors

[@dalnefre](https://github.com/dalnefre), [@tristanls](https://github.com/tristanls)

## Overview

An implementation of a revocable reference.

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

var actorBeh = function (message) {
    console.log(message);
};

var actor = sponsor(actorBeh);

var capabilities = revocable.createReference(sponsor, actor);

var ref = capabilities.reference;
ref('hello');
ref('revocable');
ref('world');

var revoke = capabilities.revoke;
var revokeAckActor = sponsor(function () {
    console.log('revoke acked');
});
revoke(revokeAckActor);

ref('this');
ref('does not get through');
```

## Tests

    npm test

## Documentation

**Public API**

  * [revocable.createReference(sponsor, actor)](#revocablecreatereferencesponsor-actor)

### revocable.createReference(sponsor, actor)

  * `sponsor`: _Sponsor_ `function (behavior) {}` Sponsor for actor creation.
  * `actor`: _Actor_ `function (message) {}` Actor to create a revocable reference for.
  * Return: _Object_ An object containing a revocable reference and a revoke capability for that reference.
    * `reference`: _Actor_ `function (message) {}` Actor that will forward all messages to the `actor` it is a reference for.
    * `revoke`: _Actor_ `function (customer) {}` Actor that upon receipt of the message will revoke the `reference`.
      * `customer`: _Actor_ `function () {}` An ack will be sent to the `customer` upon revocation.

## Sources

  * [Tiny Actor Run-Time (JavaScript)](https://github.com/organix/tartjs)