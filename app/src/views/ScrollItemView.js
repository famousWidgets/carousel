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

    function ScrollItemView() {
        View.apply(this, arguments);
    }

    ScrollItemView.prototype = Object.create(View.prototype);
    ScrollItemView.prototype.constructor = ScrollItemView;

    ScrollItemView.DEFAULT_OPTIONS = {
    };

    module.exports = ScrollItemView;
});
