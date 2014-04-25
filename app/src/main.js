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

    var surfaces = [];

    // create an array of surfaces 
    function createSurfaceArray(n, arr, size) {
        for (var i = 0; i < n; i++) {
            var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
            var surface = createSurface(color, size);
            surfaces.push(surface);
        }
    }

    // create surface
    function createSurface (color, size) {
        var testSurface = new Surface({
            size : [size, size],
            properties: {
                backgroundColor: color
            }
        });

        // addings events
        addEvent('click', testSurface);
        
        return testSurface;
    }

    function addEvent (listener, surface, cb) {
        surface.on(listener, function (e) {
            scrollView.goToNextPage();
        });
    }

    var testSurface = new Surface({
        size : [100, 100],
        properties: {
            backgroundColor: 'red'
        }
    });


    // testSurface3.on('click', function () {
    //     scrollView.goToNextPage();
    // });

    createSurfaceArray(4, surfaces, 100);

    var scrollView = new Scrollview({
        direction: Utility.Direction.X
    });

    scrollView.sequenceFrom(surfaces);
    
    mainContext.setPerspective(500);
    mainContext.add(scrollView);

});

    // var testSurface2 = new Surface({
    //     size : [100, 100],
    //     properties: {
    //         backgroundColor: 'blue'
    //     }
    // });

    //     var testSurface3 = new Surface({
    //     size : [100, 100],
    //     properties: {
    //         backgroundColor: 'black'
    //     }
    // });

    //         var testSurface4 = new Surface({
    //     size : [100, 100],
    //     properties: {
    //         backgroundColor: 'yellow'
    //     }
    // });

    // var testSurface5 = new Surface({
    //     size : [100, 100],
    //     properties: {
    //         backgroundColor: 'gray'
    //     }
    // });


    // var testSurface6 = new Surface({
    //     size : [100, 100],
    //     properties: {
    //         backgroundColor: 'green'
    //     }
    // });
