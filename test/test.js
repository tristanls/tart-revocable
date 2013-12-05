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
    tart = require('tart');

var test = module.exports = {};   

test['createReference should return a revocable reference and a revoke capability'] = function (test) {
    test.expect(2);
    var sponsor = tart.sponsor();
    var failBeh = function (message) {
        test.equal(true, "should not receive message");
    }

    var actor = sponsor(function (message) { 
        test.equal(message, 'hello');
        this.behavior = failBeh; // should not receive any more messages
    });

    var capabilities = revocable.createReference(sponsor, actor);
    capabilities.reference('hello');
    capabilities.revoke(sponsor(function () {
        test.ok(true); // revoke was acked
        capabilities.reference('hello again');
        var finish = this.sponsor(function () {
            test.done();
        });
        finish();
    }));
};