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

    /*
     * @name CarouselView
     * @constructor
     * @description
     */

    function CarouselView (options) {
        ScrollView.apply(this, arguments);
        this._scroller.group = new Group();
        this._scroller.group.add({render: _customInnerRender.bind(this._scroller)});
    }

    CarouselView.prototype = Object.create(ScrollView.prototype);
    CarouselView.prototype.constructor = CarouselView;
    // CarouselView.prototype.outputFrom  = undefined;

    CarouselView.DEFAULT_OPTIONS = {
        direction: Utility.Direction.X,
        paginated: true
    };

    function _output(node, offset, target) {
        var size = node.getSize ? node.getSize() : this._contextSize;
        
        //build our transform, figure out the scale
        var transform = oldOutput.call(this, offset, size[0]);
        var xScale = transform[0];
        var yScale = transform[5];

        target.push({transform: transform, target: node.render()});
        var scale = this.options.direction === Utility.Direction.X ? xScale : yScale;

        return size[this.options.direction] * scale;
    }

    function _customInnerRender() {
        var size = null;
        var position = this._position;
        var result = [];

        this._onEdge = 0;

        var offset = -this._positionOffset;
        var clipSize = _getClipSize.call(this);
        var currNode = this._node;
        while (currNode && offset - position < clipSize + this.options.margin) {
            offset += _output.call(this, currNode, offset, result);
            currNode = currNode.getNext ? currNode.getNext() : null;
        }

        var sizeNode = this._node;
        var nodesSize = _sizeForDir.call(this, sizeNode.getSize());
        if (offset < clipSize) {
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getPrevious();
                if (sizeNode) nodesSize += _sizeForDir.call(this, sizeNode.getSize());
            }
            sizeNode = this._node;
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getNext();
                if (sizeNode) nodesSize += _sizeForDir.call(this, sizeNode.getSize());
            }
        }

        var edgeSize = (nodesSize !== undefined && nodesSize < clipSize) ? nodesSize : clipSize;

        if (!currNode && offset - position <= edgeSize) {
            this._onEdge = 1;
            this._eventOutput.emit('edgeHit', {
                position: offset - edgeSize
            });
        }
        else if (!this._node.getPrevious() && position <= 0) {
            this._onEdge = -1;
            this._eventOutput.emit('edgeHit', {
                position: 0
            });
        }

        // backwards
        currNode = (this._node && this._node.getPrevious) ? this._node.getPrevious() : null;
        offset = -this._positionOffset;
        if (currNode) {
            size = currNode.getSize ? currNode.getSize() : this._contextSize;
            offset -= _sizeForDir.call(this, size);
        }

        while (currNode && ((offset - position) > -(_getClipSize.call(this) + this.options.margin))) {
            _output.call(this, currNode, offset, result);
            currNode = currNode.getPrevious ? currNode.getPrevious() : null;
            if (currNode) {
                size = currNode.getSize ? currNode.getSize() : this._contextSize;
                offset -= _sizeForDir.call(this, size);
            }
        }

        _normalizeState.call(this);
        return result;        
    }

    function calculateScalingFactor (screenWidth, startingScale, endingScale, position) {
        // position will be either the xPosition or yPosition values

        var midpoint = screenWidth / 2; 
        // from 0 to midpoint
        if (position <= midpoint && position >= 0) {
            return ((endingScale - startingScale) / midpoint) * position + startingScale;
        } 
        // from midpoint to screenWidth
        else if (position > midpoint && position <= screenWidth){
            return (-(endingScale - startingScale) / midpoint) * position + (2 * (endingScale - startingScale) + startingScale);
        }
        // when its offscreen
        else {
            return startingScale;
        }
    }

    function oldOutput (offset, size) {
        // for scaling
        var scaleVector = [1, 1, 1];
        var scalingFactor = calculateScalingFactor((this.options.direction === Utility.Direction.X ? window.innerWidth : window.innerHeight), 1, 2, offset + size / 2);
        
        scaleVector[0] = scalingFactor;
        scaleVector[1] = scalingFactor;

        // for translation
        var vector = [0, 0, 0];
        vector[this.options.direction] = offset;

        var transform = Transform.thenMove(Transform.scale.apply(null, scaleVector), vector);

        return transform;
    }

    // COPIED OVER FROM SCROLLER
    function _sizeForDir(size) {
        if (!size) size = this._contextSize;
        var dimension = (this.options.direction === Utility.Direction.X) ? 0 : 1;
        return (size[dimension] === undefined) ? this._contextSize[dimension] : size[dimension];
    }

    function _getClipSize() {
        if (this.options.clipSize) return this.options.clipSize;
        else return _sizeForDir.call(this, this._contextSize);
    }

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