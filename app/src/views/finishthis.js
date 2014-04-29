/*globals define*/
// define(function(require, exports, module) {
//     var View = require('famous/core/View');
//     var Surface = require('famous/core/Surface');
//     var Transform = require('famous/core/Transform');
//     var Utility = require('famous/utilities/Utility');
//     var StateModifier = require('famous/modifiers/StateModifier');
//     var ScrollView = require('famous/views/ScrollView');
//     var ScrollItemView = require('./ScrollItemView');

//     /*
//      * @name CarouselView
//      * @constructor
//      * @description
//      */

//     var CarouselView = function (num, size) {
//         ScrollView.apply(this, arguments);
//         this._scrollView = new ScrollView({
//             direction: Utility.Direction[this.options.direction],
//             paginated: this.options.paginated
//         });
//         this._scrollItemViews = [];
//         createScrollItemArray.call(this, num, size);
//         // this.sequenceFrom(this._scrollItemViews);
//         this._scrollView.outputFrom(this.output.bind(this));
//         this.add(this._scrollView);
//     };

//     CarouselView.prototype = Object.create(ScrollView.prototype);
//     CarouselView.prototype.constructor = CarouselView;
//     // CarouselView.prototype.sequenceFrom = function(array) {
//     //     return this._scrollView.sequenceFrom(array);
//     // };
//     /* CONFIGURATION this.options */
//     CarouselView.DEFAULT_OPTIONS = {
//         direction: 'X',
//         paginated: false
//         // numItems: 100,
//         // surfaceSize: 50,
//         // originX: [0, 0.5],
//         // originY: [0.5, 0],
//         // perspective: 500
//     };

//     CarouselView.prototype.output = function(offset) {
//         var direction = this.options.direction === 'X' ? 0 : 1;
        
//         // for scaling
//         var scaleVector = [1, 1, 1];
//         var scalingFactor = calculateScalingFactor((this.options.direction === 'X' ? window.innerWidth : window.innerHeight), 1, 2, offset - this._scrollView.getPosition()); //  - scrollView.getPosition()
        
//         scaleVector[0] = scalingFactor;
//         scaleVector[1] = scalingFactor;

//         // for translation
//         var vector = [0, 0, 0];
//         vector[direction] = offset;

//         var transform = Transform.thenMove(Transform.scale.apply(null, scaleVector), vector);
//         // var transform = Transform.translate.apply(null, vector);

//         return transform;
//     };

//     var createScrollItemArray = function (num, size) {
//         for (var i = 0; i < num; i += 1) {
//             var color = 'hsl(' + (i * 360 / 10) + ', 100%, 50%)';
//             var scrollItemView = new ScrollItemView(color, size, this.options.direction);

//             // surfaces is closure-scoped
//             this._scrollItemViews.push(scrollItemView);

//             // each scrollItemView sending info to scrollView            
//             this._scrollView.subscribe(scrollItemView._eventOutput);
//         }
//     };

//     var calculateScalingFactor = function (screenWidth, startingScale, endingScale, position) {
//         // position will be either the xPosition or yPosition values

//         var midpoint = screenWidth / 2; 
//         // from 0 to midpoint
//         if (position <= midpoint && position >= 0) {
//             return ((endingScale - startingScale) / midpoint) * position + startingScale;
//         } 
//         // from midpoint to screenWidth
//         else if (position > midpoint && position <= screenWidth){
//             return (-(endingScale - startingScale) / midpoint) * position + (2 * (endingScale - startingScale) + startingScale);
//         }
//         // when its offscreen
//         else {
//             return startingScale;
//         }
//     };

//     module.exports = CarouselView;
// });
