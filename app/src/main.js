/*globals define*/
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Surface = require('famous/core/Surface');
    var Scrollview = require('famous/views/Scrollview');
    var Utility = require('famous/utilities/Utility');

    // create the main context
    var mainContext = Engine.createContext();



    // create surface
    var testSurface = new Surface({
        size : [100, 100],
        properties: {
            backgroundColor: 'red'
        }
    });

    var testSurface2 = new Surface({
        size : [100, 100],
        properties: {
            backgroundColor: 'blue'
        }
    });

        var testSurface3 = new Surface({
        size : [100, 100],
        properties: {
            backgroundColor: 'black'
        }
    });

            var testSurface4 = new Surface({
        size : [100, 100],
        properties: {
            backgroundColor: 'yellow'
        }
    });

    var testSurface5 = new Surface({
        size : [100, 100],
        properties: {
            backgroundColor: 'gray'
        }
    });


    var testSurface6 = new Surface({
        size : [100, 100],
        properties: {
            backgroundColor: 'green'
        }
    });

    testSurface3.on('click', function () {
        scrollView.goToNextPage();
    });


    var testArray = [testSurface, testSurface2, testSurface3, testSurface4, testSurface5, testSurface6 ];


    var scrollView = new Scrollview({
        direction: Utility.Direction.X
    });

    scrollView.sequenceFrom(testArray);
    
    mainContext.add(scrollView);

});
