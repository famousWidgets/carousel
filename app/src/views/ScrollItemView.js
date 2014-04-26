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

    var ScrollItemView = function (color, size) {
        View.apply(this, arguments);
        
        this.color = color;
        this.size = size;
        
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
        scaleDuration: 1000,
        listener: 'click'
    };

    var addSizeModifier = function () {
        this.sizeModifier = new StateModifier({
            size: [this.size, this.size]
        });
    };

    var addStateModifier = function () {
        this.stateModifier = new StateModifier();
    };

    var addSurface = function () {
        this.surface = new Surface({
            size : [this.size, this.size],
            properties: {
                backgroundColor: this.color
            }
        });

        this.surface.on(this.options.listener, function () {
            this.stateModifier.setTransform(
                Transform.scale(this.options.xScale, this.options.yScale, 1),
                { duration: this.options.scaleDuration } 
            );

            this.sizeModifier.setSize(
                [this.surface.getSize()[0] * this.options.xScale, this.surface.getSize()[1] * this.options.yScale],
                { duration: this.options.scaleDuration }
            );            
        }.bind(this));

        this.surface.pipe(this._eventOutput);

        // add everything together
        this.add(this.sizeModifier).add(this.stateModifier).add(this.surface);
    };

    module.exports = ScrollItemView;
});
