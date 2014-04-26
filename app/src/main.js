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

    /* SETUP */

    // contains all surfaces - to be used with scrollView
    var surfaces = [];

    // create surface
    var createSurface = function (color, size) {
        var surface = new Surface({
            size : [size, size],
            properties: {
                backgroundColor: color
            }
        });

        // adding modifiers
        var surfaceModifier = new StateModifier();
        var sizeModifier = new StateModifier({
            size: [size, size]
        });

        // creating a render node as an intermediary
        var renderNode = new RenderNode();
        renderNode.add(sizeModifier).add(surfaceModifier).add(surface);

        // var view = new View();

        // exposing modifiers on the surface
        surface.modifier = surfaceModifier;
        surface.sizeModifier = sizeModifier;
        
        // adding events
        addEvent('click', surface);

        // return view.add(surfaceModifier).add(surface);
        // console.log('rn size: ', renderNode.getSize());
        return renderNode;
    };

    // create an array of surfaces 
    var createSurfaceArray = function (num, size) {
        for (var i = 0; i < num; i++) {
            var color = "hsl(" + (i * 360 / 10) + ", 100%, 50%)";
            var surface = createSurface(color, size);

            // surfaces is closure-scoped
            surfaces.push(surface);
        }
    };

    var addEvent = function (listener, surface) {
        surface.on(listener, function (e) {
            // console.log('scroll init pos: ', scrollView.getPosition());

            // scrollView is closure-scoped
            scrollView.goToNextPage();

            surface.modifier.setTransform(
                Transform.scale(2,2,1),
                {duration: 1000} 
            );

            surface.sizeModifier.setSize([200, 200], {duration: 1000});
            console.log('scroll getPosition: ', scrollView.getPosition());
        });
    };

    var modifier = new StateModifier();

    /* MAIN */

    // create main context
    var mainContext = Engine.createContext();

    // create surface and append to surfaces array
    createSurfaceArray(4, 100);

    // create scrollview
    var scrollView = new Scrollview({
        direction: Utility.Direction.X
    });

    var scrollViewModifier = new StateModifier({
        origin: [0, 0.5]
    });

    scrollView.sequenceFrom(surfaces);
    
    mainContext.setPerspective(500);
    mainContext.add(scrollViewModifier).add(scrollView);
});