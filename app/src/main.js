/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var Engine = require('famous/core/Engine');
    var StateModifier = require('famous/modifiers/StateModifier');
    var CarouselView = require('./views/CarouselView');
    var ScrollItemView = require('./views/ScrollItemView');

    var OPTIONS = {
        direction: 'X',
        originX: [0, 0.5],
        originY: [0.5, 0],
        perspective: 500
    };

    var mainContext = Engine.createContext();
    var scrollItemViews = [];

    var createScrollItemArray = function (num, size) {
        for (var i = 0; i < num; i += 1) {
            var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
            var scrollItemView = new ScrollItemView(color, size, i);

            scrollItemViews.push(scrollItemView);
        }
    };

    createScrollItemArray(100, 50);

    var carousel = new CarouselView();
    carousel.sequenceFrom(scrollItemViews);

    window.carousel = carousel;
    var carouselModifier = new StateModifier({
        origin: (OPTIONS.direction === 'X' ? OPTIONS.originX : OPTIONS.originY)
    });

    mainContext.setPerspective(OPTIONS.perspective);
    mainContext.add(carouselModifier).add(carousel);
});