/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Utility = require('famous/utilities/Utility');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ScrollView = require('famous/views/ScrollView');
    var ScrollItemView = require('./ScrollItemView');
    var Group = require('famous/core/Group');
    var OptionsManager = require('famous/core/OptionsManager');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');
    var Transitionable   = require("famous/transitions/Transitionable");
    var SpringTransition = require("famous/transitions/SpringTransition");

    /*
     * Carousel View extends Scroll View by adding functionality to enhance the scrolling effects on renderables laid out by Scroll View.
     * @class CarouselView
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the Scrollview instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Boolean} [paginated=false] A paginated scrollview will scroll through items discretely
     * rather than continously.
     * @param {Number} [minOpacity=1] There exists a opacity gradient for the renderables of Carousel View. The min opacity corresponds to the opacities at both ends of Carousel View.
     * @param {Number} [maxOpacity=1] There exists a opacity gradient for the renderables of Carousel View. The gradient increases to the max opacity as the surfaces converge towards the middle of Carousel View.
     * @param {Number} [minDepth=1] There exists a Z-translation gradient for the renderables of Carousel View. The min depth corresponds
     to the z-index at both ends of Carousel View.
     * @param {Number} [maxDepth=1] There exists a Z-translation gradient for the renderables of Carousel View. The gradient increases to the max depth as the surfaces converge towards the middle of Carousel View.
     * @param {Number} [lowerBound=0.45] Sets the position to start the Z-translation gradient for the renderables of Carousel View based on screen width or height.
     * @param {Number} [upperBound=0.55] Sets the position to end the Z-translation gradient for the renderables of Carousel View based on screen width or height.
     * @param {Number} [startDamp=0.5] Sets the dampening on the spring that handles the physics associated with initially swiveling the renderables on Carousel View.
     * @param {Number} [endDamp=0.05] Sets the dampening on the spring that handles the physics associated with ending swiveling the renderables on Carousel View.
     * @param {Number} [startPeriod=250] Sets the start period on the spring that handles the physics associated
     * with initially swiveling the renderables on Carousel View.
     * @param {Number} [endPeriod=3000] Sets the end period on the spring that handles the physics associated
     * with ending swiveling the renderables on Carousel View.
     * @param {Number} [rotateRadian=Math.PI/2] Sets the initial degree of offset for the swiveling of the renderables on Carousel View.
     * @param {Number} [rotateOrigin=[0.5,0.5]] Sets the origin of rotation for swiveling of the renderables on Carousel View.
     * @param {Number} [maxVelocity=30] Sets the maximum velocity associated with swiveling of the renderables on Carousel View.
     * @param {Number} [edgePeriod=300] Sets the period on the spring that handles the physics associated
     * with hitting the end of a scrollview.
     * @param {Number} [edgeDamp=1] Sets the damping on the spring that handles the physics associated
     * with hitting the end of a scrollview.
     */

    function CarouselView (options) {
        ScrollView.apply(this, arguments);
        this.setOptions(CarouselView.DEFAULT_OPTIONS);
        this.setOptions(options);

        this._scroller.group = new Group();
        this._scroller.group.add({render: _customInnerRender.bind(this)});

        // Registers the method 'SpringTransition' to all Transitionables. Only needs to be called once
        this.transitionableTransform = new TransitionableTransform();
        this._scroller.transitionableTransform = this.transitionableTransform;
        this._eventInput.on('update', _updateDrag.bind(this));
        this._eventInput.on('end', _endDrag.bind(this));
        Transitionable.registerMethod('spring', SpringTransition);
    }

    CarouselView.prototype = Object.create(ScrollView.prototype);
    CarouselView.prototype.constructor = CarouselView;

    CarouselView.DEFAULT_OPTIONS = {
        direction: Utility.Direction.X,
        paginated: false,
        minOpacity: 1,
        maxOpacity: 1,
        minDepth: 1,
        maxDepth: 1,
        startDamp: 0.5,
        endDamp: 0.05,
        startPeriod: 250,
        endPeriod: 3000,
        rotateRadian: Math.PI / 2,
        rotateOrigin: [0.5, 0.5],
        maxVelocity: 30,
        lowerBound: 0.45,
        upperBound: 0.55
    };

    /**
     * Overriding default behavior from scroller
     */
    function _output(node, offset, target) {
        var direction = this.options.direction;
        var depth = this.options.minDepth;
        var origin = this.options.rotateOrigin;
        var rotateRadian = this.options.rotateRadian;
        var size = node.getSize ? node.getSize() : this._contextSize;
        var position = offset + size[direction] / 2 - this._positionGetter();
        var translateXY = _translateXY.call(this, offset);
        var translateZ = _translateZ.call(this, position);
        var opacity = _customFade.call(this, position);
        var rotateMatrix = (rotateRadian === null) ? Transform.identity : this.transitionableTransform.get();
        var xyzTranslation = Transform.multiply4x4(translateXY, translateZ);
        var transform = Transform.multiply4x4(xyzTranslation, rotateMatrix);

        target.push({
            size: size,
            opacity: opacity,
            target: {
                origin: origin,
                target: {
                    transform: transform,
                    target: node.render()
                }
            }
        });

        return size[direction];
    }

    function _translateXY (offset) {
        var direction = this.options.direction;
        var vector = [0, 0, 0];
        vector[direction] = offset;
        return Transform.translate.apply(null, vector);
    }


    function _translateZ (midpoint) {
        var screenWidth = this.options.direction === Utility.Direction.X ? window.innerWidth : window.innerHeight;
        var minDepth = this.options.minDepth;
        var maxDepth = this.options.maxDepth;
        var lowerBound = this.options.lowerBound * screenWidth;
        var upperBound = this.options.upperBound * screenWidth;

        var scale = _scalingFactor(screenWidth, minDepth, maxDepth, midpoint, upperBound, lowerBound);
        return Transform.translate.apply(null, [0, 0, scale]);
    }

    /**
     * Helper function for providing a opacity and Z-translation gradient that increases as the position of the renderables converge towards the middle of Carousel View.
     */
    function _scalingFactor (screenWidth, startScale, endScale, currentPosition, upperB, lowerB) {
        lowerB = lowerB || 0;
        upperB = upperB || screenWidth;
        var midpoint = (upperB + lowerB) / 2;

        if (currentPosition >= lowerB && currentPosition <= midpoint) {
            return 2 * (endScale - startScale) / (upperB - lowerB) * currentPosition + (endScale  - (upperB + lowerB) * (endScale - startScale) / (upperB - lowerB));
        } else if (currentPosition > midpoint && currentPosition <= upperB) {
            return 2 * (startScale - endScale) / (upperB - lowerB) * currentPosition + (endScale - (startScale - endScale) * (upperB + lowerB) / (upperB - lowerB));
        } else {
            return startScale;
        }
    }
    /**
     * Adjust opacity for renderables for Carousel View
     */
    function _customFade (position) {
        var screenWidth = this.options.direction === Utility.Direction.X ? window.innerWidth : window.innerHeight;
        var minOpacity = this.options.minOpacity;
        var maxOpacity = this.options.maxOpacity;
        return _scalingFactor(screenWidth, minOpacity, maxOpacity, position);
    }
    /**
     * Sets the initial spring state of the renderable when swiveling starts
     */
    function _updateDrag (e) {
        var maxVelocity = this.options.maxVelocity;
        this.transitionableTransform.halt();

        var position;
        if (e.velocity < 0) {
            position = Math.PI/4;
        } else {
            position = -Math.PI/4;
        }

        if (Math.abs(e.velocity) >= maxVelocity) {
            e.velocity = maxVelocity;
        }

        this.transitionableTransform.set(
            Transform.rotateY(position * Math.abs(e.velocity)),
            // Transform.rotateY(position * Math.abs(e.velocity / maxVelocity)),
            {
                method : 'spring',
                period : this.options.startPeriod,
                dampingRatio : this.options.startDamp
            }
        );
    }
    /**
     * Sets the end spring state of the renderable when swiveling ends
     */
    function _endDrag (e) {
        this.transitionableTransform.halt();
        this.transitionableTransform.set(
            Transform.rotateY(0),
            {
                method : 'spring',
                period : this.options.endPeriod,
                dampingRatio : this.options.endDamp
            }
        );
    }

     /**
     * Overriding default behavior from scroller
     */
    function _customInnerRender() {
        var scroller = this._scroller;

        var size = null;
        var position = scroller._position;
        var result = [];

        scroller._onEdge = 0;

        var offset = -scroller._positionOffset;
        var clipSize = _getClipSize.call(scroller);
        var currNode = scroller._node;
        while (currNode && offset - position < clipSize + scroller.options.margin) {
            offset += _output.call(scroller, currNode, offset, result);
            currNode = currNode.getNext ? currNode.getNext() : null;
        }

        var sizeNode = scroller._node;
        var nodesSize = _sizeForDir.call(scroller, sizeNode.getSize());
        if (offset < clipSize) {
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getPrevious();
                if (sizeNode) nodesSize += _sizeForDir.call(scroller, sizeNode.getSize());
            }
            sizeNode = scroller._node;
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getNext();
                if (sizeNode) nodesSize += _sizeForDir.call(scroller, sizeNode.getSize());
            }
        }

        var edgeSize = (nodesSize !== undefined && nodesSize < clipSize) ? nodesSize : clipSize;

        if (!currNode && offset - position <= edgeSize) {
            scroller._onEdge = 1;
            scroller._eventOutput.emit('edgeHit', {
                position: offset - edgeSize
            });
        }
        else if (!scroller._node.getPrevious() && position <= 0) {
            scroller._onEdge = -1;
            scroller._eventOutput.emit('edgeHit', {
                position: 0
            });
        }

        // backwards
        currNode = (scroller._node && scroller._node.getPrevious) ? scroller._node.getPrevious() : null;
        offset = -scroller._positionOffset;
        if (currNode) {
            size = currNode.getSize ? currNode.getSize() : scroller._contextSize;
            offset -= _sizeForDir.call(scroller, size);
        }

        while (currNode && ((offset - position) > -(_getClipSize.call(scroller) + scroller.options.margin))) {
            _output.call(scroller, currNode, offset, result);
            currNode = currNode.getPrevious ? currNode.getPrevious() : null;
            if (currNode) {
                size = currNode.getSize ? currNode.getSize() : scroller._contextSize;
                offset -= _sizeForDir.call(scroller, size);
            }
        }

        _normalizeState.call(scroller);
        return result;
    }
    /**
    * Identical functionality from scroller
    */
    function _sizeForDir(size) {
        if (!size) size = this._contextSize;
        var dimension = (this.options.direction === Utility.Direction.X) ? 0 : 1;
        return (size[dimension] === undefined) ? this._contextSize[dimension] : size[dimension];
    }
    /**
    * Identical functionality from scroller
    */
    function _getClipSize() {
        if (this.options.clipSize) return this.options.clipSize;
        else return _sizeForDir.call(this, this._contextSize);
    }
    /**
    * Identical functionality from scroller
    */
    function _normalizeState() {
        var nodeSize = _sizeForDir.call(this, this._node.getSize());
        var nextNode = this._node && this._node.getNext ? this._node.getNext() : null;
        while (nextNode && this._position + this._positionOffset >= nodeSize) {
            this._positionOffset -= nodeSize;
            this._node = nextNode;
            nodeSize = _sizeForDir.call(this, this._node.getSize());
            nextNode = this._node && this._node.getNext ? this._node.getNext() : null;
        }
        var prevNode = this._node && this._node.getPrevious ? this._node.getPrevious() : null;
        while (prevNode && this._position + this._positionOffset < 0) {
            var prevNodeSize = _sizeForDir.call(this, prevNode.getSize());
            this._positionOffset += prevNodeSize;
            this._node = prevNode;
            prevNode = this._node && this._node.getPrevious ? this._node.getPrevious() : null;
        }
    }

    module.exports = CarouselView;
});