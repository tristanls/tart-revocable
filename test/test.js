/*

test.js - test script

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

var revocable = require('../index.js'),
    tart = require('tart-tracing');

var test = module.exports = {};   

test['proxy() should return a revocable proxy and a revoke capability'] = function (test) {
    test.expect(3);
    var tracing = tart.tracing();
    var sponsor = tracing.sponsor;

    var secret, capabilities, proxy, revoke;

    var failBeh = function failBeh(message) {
        test.equal(true, "should not receive message");
    }

    secret = sponsor(function secretBeh(message) {
        test.equal(message, 'hello');
        this.behavior = failBeh; // should not receive any more messages
        var ackCustomer = this.sponsor(ackCustomerBeh);
        revoke(ackCustomer);
    });

    var ackCustomerBeh = function ackCustomerBeh(message) {
        test.ok(true); // revoke was acked
        proxy('hello again'); // should never reach `secret`
    };

    capabilities = revocable.proxy(secret);
    proxy = sponsor(capabilities.proxyBeh);
    revoke = sponsor(capabilities.revokeBeh);

    proxy('hello');

    var ignore = function () {};

    test.ok(tracing.eventLoop({fail: ignore}));
    test.done();
};

test['proxy() should throw an exception if receiving message after being revoked'] = function (test) {
    test.expect(4);
    var tracing = tart.tracing();
    var sponsor = tracing.sponsor;

    var secret, capabilities, proxy, revoke;

    secret = sponsor(function secretBeh(message) {
        test.equal(false, 'should not be called');
    });

    var ackCustomerBeh = function ackCustomerBeh(message) {
        test.ok(true); // revoke was acked
    };

    capabilities = revocable.proxy(secret);
    proxy = sponsor(capabilities.proxyBeh);
    revoke = sponsor(capabilities.revokeBeh);

    var ackCustomer = sponsor(ackCustomerBeh);
    revoke(ackCustomer);

    // drain all the events to ensure revoke took place
    test.ok(tracing.eventLoop());

    proxy('hello');

    test.ok(tracing.eventLoop({fail: function (exception) {
        test.ok(exception);
    }}));

    test.done();
};