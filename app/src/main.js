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

    var carousel = new CarouselView({
        // endScale: 2,
        // startFade: 0.1,
        // endDepth: 50
        // rotateRadian: null
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

    window.carousel = carousel;
    var carouselModifier = new StateModifier({
        origin: [0, 0.5]
    });

    // var blahSurface = new Surface({
    //     size: [100, 100],
    //     properties: {
    //         backgroundColor: 'red'
    //     }
    // });

    // var blahModifier = new StateModifier({
    //     origin: [0.5, 0.5]
    // });

    // blahModifier.setTransform(
    //    Transform.rotateY(2 * Math.PI),
    //    { duration: 10000 } 
    // );

    mainContext.setPerspective(300);
    mainContext.add(carouselModifier).add(carousel);
    mainContext.add(midHMod).add(midHSurface);
    // mainContext.add(blahModifier).add(blahSurface);
});