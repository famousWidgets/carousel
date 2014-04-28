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
        this.isLarge = false;
        
        // modifiers must be called first
        addSizeModifier.call(this);
        addStateModifier.call(this);

        addSurface.call(this);

        // for testing purposes - remove later
        // window['surface' + count] = this.surface;
        // window['surfaceView' + count] = this;

        // listening from ScrollView
        // var i = 0; // --> for testing purposes
        this._eventInput.on('message', function (data) {
            if (this.surface._matrix !== null) { //  && (i++ % 50 === 0) --> for testing purposes
                var surfaceMidpoint = -Math.floor(data.offset) + this.surface._matrix[12] + Math.floor(this.sizeModifier.getSize()[0]/2);
                var scalingFactor = calculateScalingFactor(data.screenSize[0], 1, 2, surfaceMidpoint);
                this.stateModifier.setTransform(
                    Transform.scale(scalingFactor, scalingFactor, 1)
                    // { duration: 1 }
                );

                this.sizeModifier.setSize(
                    [this.surface.getSize()[0] * scalingFactor, this.surface.getSize()[1] * scalingFactor]
                    // { duration: 1 }
                );
                // console.log("offset", -data.offset);
                // console.log("screenSize", data.screenSize);
                // console.log("x position", this.surface._matrix[12]);
                // console.log("surface", this.surface);    
            }
        }.bind(this));
    };

    ScrollItemView.prototype = Object.create(View.prototype);
    ScrollItemView.prototype.constructor = ScrollItemView;

    ScrollItemView.DEFAULT_OPTIONS = {
        // xScaleUp: 2,
        // yScaleUp: 2,
        // xScaleDown: 1,
        // yScaleDown: 1,
        // scaleDuration: 1000,
        // listener: 'click'
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

        // OLD CODE
        // this.surface.on(this.options.listener, function () {
        //     // check if surface is small
        //     if (!this.isLarge) {
        //         this.stateModifier.setTransform(
        //             Transform.scale(this.options.xScaleUp, this.options.yScaleUp, 1),
        //             { duration: this.options.scaleDuration } 
        //         );

        //         this.sizeModifier.setSize(
        //             [this.surface.getSize()[0] * this.options.xScaleUp, this.surface.getSize()[1] * this.options.yScaleUp],
        //             { duration: this.options.scaleDuration }
        //         );
        //     } else {
        //         // surface is large
        //         this.stateModifier.setTransform(
        //             Transform.scale(this.options.xScaleDown, this.options.yScaleDown, 1),
        //             { duration: this.options.scaleDuration } 
        //         );

        //         this.sizeModifier.setSize(
        //             [this.surface.getSize()[0], this.surface.getSize()[1]],
        //             { duration: this.options.scaleDuration }
        //         );
        //     }
        //     // toggle
        //     this.isLarge = !this.isLarge;
        // }.bind(this));

        this.surface.pipe(this._eventOutput);

        // add everything together
        this.add(this.sizeModifier).add(this.stateModifier).add(this.surface);
    };

    // var calculateSurfaceMidpoint = function (offset, surfacePositionX) {

    // };

    var calculateScalingFactor = function (screenWidth, startingScale, endingScale, xPosition) {
        var midpoint = screenWidth / 2;

        // from 0 to midpoint
        if (xPosition <= midpoint && xPosition >= 0) {
            return ((endingScale - startingScale) / midpoint) * xPosition + startingScale;
        } 
        // from midpoint to screenWidth
        else if (xPosition > midpoint && xPosition <= screenWidth){
            return (-(endingScale - startingScale) / midpoint) * xPosition + (2 * (endingScale - startingScale) + startingScale);
        }
        // when its offscreen
        else {
            return startingScale;
        }
    };

    module.exports = ScrollItemView;
});
