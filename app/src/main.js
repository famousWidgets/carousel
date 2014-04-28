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

    var ScrollItemView = require('./views/ScrollItemView');

    /* CONFIGURATION OPTIONS */
    var OPTIONS = {
        direction: 'X',
        paginated: false,
        numItems: 100,
        surfaceSize: 50,
        originX: [0, 0.5],
        originY: [0.5, 0],
        perspective: 500
    };

    /* MAIN */

    // contains list of scrollItemViews - to be used with scrollView
    var scrollItemViews = [];

    // create main context
    var mainContext = Engine.createContext();

    var scrollView = new Scrollview({
        direction: Utility.Direction[OPTIONS.direction],
        paginated: OPTIONS.paginated
    });

    function carousel(offset) {
        var direction = this.options.direction;
        var vector = [0, 0, 0];
        vector[direction] = offset;

        var scaleVector = [1, 1, 1];

        scaleVector[1] = 1 + (offset * 0.005);

        var transform = Transform.thenMove(Transform.scale.apply(null, scaleVector), vector);

        return transform;
    }

    scrollView.outputFrom(carousel.bind(scrollView));

    var scrollViewModifier = new StateModifier({
        origin: (OPTIONS.direction === 'X' ? OPTIONS.originX : OPTIONS.originY)
    });

    var createScrollItemArray = function (num, size) {
        for (var i = 0; i < num; i += 1) {
            var color = 'hsl(' + (i * 360 / 10) + ', 100%, 50%)';
            var scrollItemView = new ScrollItemView(color, size, OPTIONS.direction);

            // surfaces is closure-scoped
            scrollItemViews.push(scrollItemView);

            // each scrollItemView sending info to scrollView            
            scrollView.subscribe(scrollItemView._eventOutput);

            // scrollView sending info to each scrollItemView
            scrollView.pipe(scrollItemView._eventInput);
        }
    };

    // populate scrollItemViews array
    createScrollItemArray(OPTIONS.numItems, OPTIONS.surfaceSize);
    scrollView.sequenceFrom(scrollItemViews);

    mainContext.setPerspective(OPTIONS.perspective);
    mainContext.add(scrollViewModifier).add(scrollView);

    // scrollView._eventInput.on('update', function () {
    //     // send information to each scrollViewItem
    //     scrollView._eventOutput.emit('message', {
    //         'offset': scrollView.getPosition(),
    //         'screenSize': scrollView.getSize()
    //     });
    // });
});