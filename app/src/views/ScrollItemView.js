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

    var ScrollItemView = function (color, size, direction) { // count
        View.apply(this, arguments);
        
        this.color = color;
        this.size = size;
        this.direction = direction;
        
        // modifiers must be called first
        addSizeModifier.call(this);
        addStateModifier.call(this);

        addSurface.call(this);

        // for testing purposes - remove later
        // window['surface' + count] = this.surface;
        // window['surfaceView' + count] = this;

        // listening from ScrollView
        // this._eventInput.on('message', function (data) {
        //     if (this.surface._matrix !== null) {
        //         var surfaceMidpoint, scalingFactor;

        //         if (this.direction === 'X') {
        //             surfaceMidpoint = -Math.floor(data.offset) + this.surface._matrix[12] + Math.floor(this.sizeModifier.getSize()[0]/2);
        //             scalingFactor = calculateScalingFactor(data.screenSize[0], this.options.initialScale, this.options.finalScale, surfaceMidpoint);
        //         } else {
        //             surfaceMidpoint = -Math.floor(data.offset) + this.surface._matrix[13] + Math.floor(this.sizeModifier.getSize()[1]/2);
        //             scalingFactor = calculateScalingFactor(data.screenSize[1], this.options.initialScale, this.options.finalScale, surfaceMidpoint);
        //         }

        //         this.stateModifier.setTransform(
        //             Transform.scale(scalingFactor, scalingFactor, 1)
        //         );

        //         this.sizeModifier.setSize(
        //             [this.surface.getSize()[0] * scalingFactor, this.surface.getSize()[1] * scalingFactor]
        //         );
        //     }
        // }.bind(this));
    };

    ScrollItemView.prototype = Object.create(View.prototype);
    ScrollItemView.prototype.constructor = ScrollItemView;
    
    // will get called by ScrollView for each scrollItemView
    ScrollItemView.prototype.getSize = function () {
        if (this.surface._matrix) {
            return [ this.surface._matrix[0] * this.size, this.surface._matrix[5] * this.size ];
        } else {
            return [ this.size, this.size ];
        }
    };

    ScrollItemView.DEFAULT_OPTIONS = {
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

        this.surface.pipe(this._eventOutput);

        // add everything together
        this.add(this.sizeModifier).add(this.stateModifier).add(this.surface);
    };

    module.exports = ScrollItemView;
});
