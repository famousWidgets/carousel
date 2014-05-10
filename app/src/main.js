/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var CarouselView = require('./views/CarouselView');
    var ScrollItemView = require('./views/ScrollItemView');
    var OptionsView = require('./views/OptionsView');
    var AppView = require('./views/AppView');
    var Utility = require('famous/utilities/Utility');
    var Transform = require('famous/core/Transform');

    var mainContext = Engine.createContext();
    var scrollItemViews = [];
    var appView = new AppView();
    // DEMO SCENARIOS

    // 1) Background Surfaces

    // Rainbow Colors with Views
    // var createScrollItemArray = function (num, size) {
    //     for (var i = 0; i < num; i += 1) {
    //         var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
    //         var scrollItemView = new ScrollItemView(color, size);
    //         scrollItemViews.push(scrollItemView);
    //         carousel.subscribe(scrollItemView);
    //     }
    // };

    // Rainbow Colors with Surfaces
    // var createScrollItemArray = function (num, size) {
    //     for (var i = 0; i < num; i += 1) {
    //         var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
    //         var surface = new Surface({
    //             content: 'Hello Hack Reactor',
    //             size: [size, size],
    //             properties: {
    //                 backgroundColor: color
    //             }
    //         });
    //         scrollItemViews.push(surface);
    //         carousel.subscribe(surface);
    //     }
    // };

    // Background Images with Click Listener
    // var createScrollItemArray = function (num, size) {
    //     for (var i = 0; i < num; i += 1) {
    //         var scrollItemView = new Surface({
    //             content: "<img src='../content/images/hack-reactor.png' height='" + size + "' width='" + size + "'>",
    //             size: [size, size]
    //         });
    //         scrollItemView.on('click', function () {
    //             alert('Hello Hack Reactor!');
    //         });
    //         scrollItemViews.push(scrollItemView);
    //         carousel.subscribe(scrollItemView);
    //     }
    // };


    // 2) Different Configurations

    // Baseline scenario
    // var carousel = new CarouselView({
    //     rotateRadian: null
    // });

    // Fading - with baseline
    // var carousel = new CarouselView({
    //     startFade: 0.1,
    //     rotateRadian: null
    // });

    // Z Index - with baseline
    // var carousel = new CarouselView({
    //     endDepth: 20,
    //     rotateRadian: null
    // });

    // Physics Engine - with baseline
    // var carousel = new CarouselView({
    // });

    // Everything Scenario
    // var carousel = new CarouselView({
    //     startFade: 0.1,
    //     endDepth: 200,
    //     lowerBound: 0.35,
    //     upperBound: 0.65
    // });

    // Greg - custom depth scaling
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
    // });s


    // HR DEMO
    // 1) Fading colors with square views
    // var createScrollItemArray = function (num, size) {
    //     for (var i = 0; i < num; i += 1) {
    //         var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
    //         var scrollItemView = new ScrollItemView(color, size);
    //         scrollItemViews.push(scrollItemView);
    // //         carousel.subscribe(scrollItemView);
    // //     }
    // // };

    // // 2) Z index with hack reactor logo
    // var createScrollItemArray = function (num, size) {
    //     for (var i = 0; i < num; i += 1) {
    //         var scrollItemView = new Surface({
    //             content: "<img src='../content/images/hack-reactor.png' height='" + size + "' width='" + size + "'>",
    //             size: [size, size]
    //         });
    //         scrollItemView.on('click', function () {
    //             alert('Hello Hack Reactor!');
    //         });
    //         scrollItemViews.push(scrollItemView);
    //         carousel.subscribe(scrollItemView);
    //     }
    // };

    // 3) Physics engine with z-index and doge pic
    var createScrollItemArray = function (num, size) {
        for (var i = 0; i < num; i += 1) {
            var scrollItemView = new Surface({
                content: "<img src='../content/images/picasso.jpeg' height='" + size + "' width='" + size + "'>",
                size: [size, size]
            });
            scrollItemViews.push(scrollItemView);
            carousel.subscribe(scrollItemView);
        }
    };

    // CONFIGURATIONS
    // 1) Fading colors with square views
    // var carousel = new CarouselView({
    //     pageDamp: 0.8,
    //     rails: true,
    //     startFade: 0.1,
    //     rotateRadian: null
    // });

    // Scrollview.DEFAULT_OPTIONS = {
    //     direction: Utility.Direction.Y,
    //     rails: true,
    //     friction: 0.001,
    //     drag: 0.0001,
    //     edgeGrip: 0.5,
    //     edgePeriod: 300,
    //     edgeDamp: 1,
    //     paginated: false,
    //     pagePeriod: 500,
    //     pageDamp: 0.8,
    //     pageStopSpeed: 10,
    //     pageSwitchSpeed: 0.5,
    //     speedLimit: 10
    // };


    // 2) Z index with hack reactor logo
    var carousel = new CarouselView({
        edgeDamp: 0.1,
        edgePeriod: 1000,
        rotateRadian: null
        // endDepth: 100
    });

    // 3) Physics engine with z-index and doge pic
    // var carousel = new CarouselView({
    //     startFade: 0.1,
    //     endDepth: 200,
    //     lowerBound: 0.35,
    //     upperBound: 0.65
    // });


    var carouselModifier = new StateModifier({
        origin: [0, 0.5]
    });

    createScrollItemArray(100, 150);
    carousel.sequenceFrom(scrollItemViews);

    // adding a visual on screen for midpoint
    // var midHSurface = new Surface({
    //     size : [5, window.innerHeight],
    //     properties: {
    //         backgroundColor: 'red'
    //     }
    // });

    // var midHMod = new StateModifier({
    //     origin: [0.5, 0]
    // });]

    var optionsView = new OptionsView();
    var optionsModifier = new StateModifier({
        size: [undefined,200],
        origin: [0,1]
    })


    optionsView.pipe(appView);

    mainContext.setPerspective(500);
    mainContext.add(appView);
    // appView.add(carouselModifier).add(carousel);
    mainContext.add(optionsModifier).add(optionsView);
    // mainContext.add(midHMod).add(midHSurface);
});