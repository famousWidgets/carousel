/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name ScrollItemView
     * @constructor
     * @description
     */

    var ScrollItemView = function () {
        View.apply(this, arguments);
        
        // modifiers must be called first
        addSizeModifier.call(this);
        addStateModifier.call(this);

        addSurface.call(this);
    };

    ScrollItemView.prototype = Object.create(View.prototype);
    ScrollItemView.prototype.constructor = ScrollItemView;

    ScrollItemView.DEFAULT_OPTIONS = {
        xScale: 2,
        yScale: 2,
        scaleDuration: 1000
    };

    var addSurface = function (color, size) {
        this.surface = new Surface({
            size : [size, size],
            properties: {
                backgroundColor: color
            }
        });

        addListener.call(this.surface);
    };

    var addSizeModifier = function () {
        this.sizeModifier = new StateModifier({
            size: [size, size]
        });
    };

    var addStateModifier = function () {
        this.stateModifier = new StateModifier();
    };

    var addListener = function () {
        // 'this' will be surface
        this.stateModifier.setTransform(
            Transform.scale(xScale, yScale, 1),
            { duration: scaleDuration } 
        );

        this.sizeModifier.setSize(
            [this.getSize()[0].xScale, this.getSize()[1].yScale],
            { duration: scaleDuration }
        );
    };

    module.exports = ScrollItemView;
});
