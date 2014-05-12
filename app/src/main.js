/**
 * Copyright (c) 2014 Famous Industries, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * @license MIT
 */

 /**
  * Carousel View
  * -------
  *
  * Carousel View extends Scroll View by adding functionality to enhance the scrolling effects on renderables laid out by Scroll View.
  * There are different options you can pass into Carousel View to customize its functionality.
  *
  * In this example, we create an array of surfaces and sequence it into Carousel View.
  *
  */

/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var CarouselView = require('./views/CarouselView');
    var Utility = require('famous/utilities/Utility');
    var Transform = require('famous/core/Transform');

    var mainContext = Engine.createContext();
    var surfaces = [];

    var createSurfaceArray = function (num, size) {
        for (var i = 0; i < num; i += 1) {
            var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
            var surface = new Surface({
                content: '<p style="text-align: center;">Are you Famo.us?</p>',
                size: [size, size],
                properties: {
                    backgroundColor: color
                }
            });
            surfaces.push(surface);
            carousel.subscribe(surface);
        }
    };

    var carousel = new CarouselView({
        startDamp: 0.5,
        endDamp: 0.3,
        startPeriod: 100,
        endPeriod: 1000,
        rotateRadian: Math.PI / 2,
        maxVelocity: 10,
        lowerBound: 0.25,
        upperBound: 0.5,
        endDepth: 200
    });

    var carouselModifier = new StateModifier({
        origin: [0, 0.5]
    });

    createSurfaceArray(100, 150);
    carousel.sequenceFrom(surfaces);

    mainContext.setPerspective(500);
    mainContext.add(carouselModifier).add(carousel);
});