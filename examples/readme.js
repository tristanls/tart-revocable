/*

readme.js - example from the README

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
