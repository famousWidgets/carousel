/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var CarouselView = require('./CarouselView');
    var ScrollItemView = require('./ScrollItemView');


    /*
     * @name AppView
     * @constructor
     * @description
     */

    function AppView() {
        View.apply(this, arguments);
        createScrollView.call(this);
        _setListeners.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
    };

    function createScrollView(options) {
        var scrollItemViews = [];
        options = options ||
        {
            rotateRadian: null
        };
        var createScrollItemArray = function (num, size) {
            for (var i = 0; i < num; i += 1) {
                var scrollItemView = new Surface({
                    content: "<img src='../content/images/picasso.jpeg' height='" + size + "' width='" + size + "'>",
                    size: [size, size]
                });
                scrollItemViews.push(scrollItemView);
                this.carousel.subscribe(scrollItemView);
            }
        }.bind(this);
        this.carousel = new CarouselView(options);
        this.carouselModifier = new StateModifier({
            origin: [0, 0.5]
        });

        createScrollItemArray(100, 150);
        this.carousel.sequenceFrom(scrollItemViews);

        this.add(this.carouselModifier).add(this.carousel);
    }

    function _setListeners() {

        this._eventInput.on('fade', function() {
            this.carousel.setOptions({
                startFade: 0.5,
                endFade: 1
            });
        }.bind(this));

        this._eventInput.on('depth', function() {
            this.carousel.setOptions({endDepth:100});
        }.bind(this));

        this._eventInput.on('swivel', function() {
            this.carousel.setOptions({rotateRadian: Math.PI / 2});
        }.bind(this));

        this._eventInput.on('bounce', function() {
            this.carousel.setOptions({
                edgeDamp: 0.1,
                edgePeriod: 1000
            });

        }.bind(this));

    }

    module.exports = AppView;
});
