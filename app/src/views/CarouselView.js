/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name CarouselView
     * @constructor
     * @description
     */

    var CarouselView = function () {
        View.apply(this, arguments);
        this._scrollView = new ScrollView();
    };

    CarouselView.prototype = Object.create(View.prototype);
    CarouselView.prototype.constructor = CarouselView;

    CarouselView.DEFAULT_OPTIONS = {
    };

    module.exports = CarouselView;
});
