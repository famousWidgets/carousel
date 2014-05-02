/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var CarouselView = require('./views/CarouselView');
    var ScrollItemView = require('./views/ScrollItemView');
    var Utility = require('famous/utilities/Utility');
    var Transform = require('famous/core/Transform');

    var mainContext = Engine.createContext();
    var scrollItemViews = [];

    var createScrollItemArray = function (num, size) {
        for (var i = 0; i < num; i += 1) {
            var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
            var scrollItemView = new ScrollItemView(color, size);
            scrollItemViews.push(scrollItemView);
            carousel.subscribe(scrollItemView);
        }
    };

    // var createScrollItemArray = function (num, size) {
    //     for (var i = 0; i < num; i += 1) {
    //         var scrollItemView = new Surface({
    //             content: "<img src='../content/images/famous_logo.png' height='" + size + "' width='" + size + "'>",
    //             size: [size, size]
    //         });
    //         scrollItemViews.push(scrollItemView);
    //         carousel.subscribe(scrollItemView);
    //     }
    // };

    // DEMO SCENARIOS

    // // BASELINE SCENARIO
    // var carousel = new CarouselView({
    //     startFade: 0.1,
    //     // endDepth: 20,
    //     // lowerBound: 0,
    //     // upperBound: 1

    //     rotateRadian: null
    // });

    // // greg custom depth scaling check
    // var carousel = new CarouselView({
    //     // startDamp: 0.5,             // 0.5
    //     // endDamp: 0.3,               // 0.1
    //     // startPeriod: 100,           // 250
    //     // endPeriod: 1000,            // 2000
    //     // rotateRadian: Math.PI / 2,  // Math.PI / 2
    //     // maxVelocity: 10
    //     lowerBound: 0.25,
    //     upperBound: 0.5,
    //     endDepth: 200
    // });

    // FADING SCENARIO - with baseline
    // var carousel = new CarouselView({
    //     startFade: 0.1,
    //     rotateRadian: null
    // });

    // Z INDEX SCENARIO - with baseline
    // var carousel = new CarouselView({
    //     endDepth: 20,
    //     rotateRadian: null
    // });

    // PHYSICS ENGINE SCENARIO - with baseline
    // var carousel = new CarouselView({
    // });

    // EVERYTHING SCENARIO
    var carousel = new CarouselView({
        startFade: 0.1,
        endDepth: 20,
        lowerBound: 0.25,
        upperBound: 0.75
    });


    var carouselModifier = new StateModifier({
        origin: [0, 0.5]
    });

    createScrollItemArray(100, 100);
    carousel.sequenceFrom(scrollItemViews);

    // adding a visual on screen for midpoint
    var midHSurface = new Surface({
        size : [5, window.innerHeight],
        properties: {
            backgroundColor: 'red'
        }
    });

    var midHMod = new StateModifier({
        origin: [0.5, 0]
    });

    mainContext.setPerspective(1000);
    mainContext.add(carouselModifier).add(carousel);
    mainContext.add(midHMod).add(midHSurface);
});