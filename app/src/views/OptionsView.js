/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name OptionsView
     * @constructor
     * @description
     */

    function OptionsView() {
        View.apply(this, arguments);
        this.createSurfaces.call(this);
        this._setListeners.call(this);
    }

    OptionsView.prototype = Object.create(View.prototype);
    OptionsView.prototype.constructor = OptionsView;

    OptionsView.DEFAULT_OPTIONS = {
    };
    OptionsView.prototype.createSurfaces = function() {
        var surfaceMain = new Surface({
            size: [undefined, 200],
            content: 'hello',
            properties: {
                backgroundColor: 'gray',
                opacity: 0.5
            }
        });
        this.depthButton = new Surface({
            size: [100,100],
            content: 'give me depth',
            properties: {
                backgroundColor: 'green'
            }
        })
        var depthButtonModifier = new StateModifier({
            origin: [0., 0]
        })
        this.swivelButton = new Surface({
            size: [100,100],
            content: 'swivel me',
            properties: {
                backgroundColor: 'blue'
            }
        })
        var swivelButtonModifier = new StateModifier({
            origin: [0, 1]
        })
        this.bounceButton = new Surface({
            size: [100,100],
            content: 'bounce me',
            properties: {
                backgroundColor: 'orange'
            }
        })
        var bounceButtonModifier = new StateModifier({
            origin: [1, 0]
        })
        this.fadeButton = new Surface({
            size: [100,100],
            content: 'fade me',
            properties: {
                backgroundColor: 'yellow'
            }
        })
        var fadeButtonModifier = new StateModifier({
            origin: [1, 1]
        })
        var main = this.add(surfaceMain);
        this.add(depthButtonModifier).add(this.depthButton);
        this.add(swivelButtonModifier).add(this.swivelButton);
        this.add(bounceButtonModifier).add(this.bounceButton);
        this.add(fadeButtonModifier).add(this.fadeButton);
    };

    OptionsView.prototype._setListeners = function() {
        this.depthButton.on('click', function() {
            this._eventOutput.emit('depth');
        }.bind(this));
        this.swivelButton.on('click', function() {
            this._eventOutput.emit('swivel');
        }.bind(this));
        this.bounceButton.on('click', function() {
            this._eventOutput.emit('bounce');
        }.bind(this));
        this.fadeButton.on('click', function() {
            console.log('fade');
            this._eventOutput.emit('fade');
        }.bind(this));

    };
    module.exports = OptionsView;
});
