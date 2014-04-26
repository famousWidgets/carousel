/*
  plan: 
    create wave effect
*/

/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var Engine = require('famous/core/Engine');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Surface = require('famous/core/Surface');
    var Scrollview = require('famous/views/Scrollview');
    var Utility = require('famous/utilities/Utility');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var Draggable = require('famous/modifiers/Draggable');

    var ScrollItemView = require('./views/ScrollItemView');

    var createScrollItemArray = function (num, size) {
        for (var i = 0; i < num; i += 1) {
            var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
            var scrollItemView = new ScrollItemView(color, size);

            // surfaces is closure-scoped
            scrollItemViews.push(scrollItemView);
            scrollView.subscribe(scrollItemView._eventOutput);
        }
    };

    /* MAIN */

    // contains list of scrollItemViews - to be used with scrollView
    var scrollItemViews = [];

    // create main context
    var mainContext = Engine.createContext();

    var scrollView = new Scrollview({
        direction: Utility.Direction.X
        // paginated: true
    });

    var scrollViewModifier = new StateModifier({
        origin: [0, 0.5]
    });

    // var draggable = new Draggable({
    //     xRange: [-220, 220],
    //     yRange: [0, 0]
    // });

    // populate scrollItemViews array
    createScrollItemArray(4, 100);
    scrollView.sequenceFrom(scrollItemViews);

    mainContext.setPerspective(500);
    mainContext.add(scrollViewModifier).add(scrollView);
});