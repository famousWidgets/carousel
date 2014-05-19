/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var CarouselView = require('./CarouselView');
    // var ScrollItemView = require('./ScrollItemView');


    /*
     * @name AppView
     * @constructor
     * @description
     */

    function AppView() {
        View.apply(this, arguments);
        createScrollView.call(this);
        _setListeners.call(this);
        this.depthCount = 1;
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
    };

    function createScrollView(options) {
        var scrollItemViews = [];
        options = options ||
        {
            lowerBound: 0.3,
            upperBound: 0.7,
            rotateRadian: null
        };
        var createScrollItemArray = function (num, size) {
            for (var i = 0; i < num; i += 1) {
                var scrollItemView = new Surface({
                    content: '<div class="agMovie agMovie-lulg mr125"><span id="dbs60031236_0" class="boxShot boxShot-166 queueable  hoverPlay  bobbable vbox_60031236"><img class="boxShotImg hideBobBoxshot" alt="Kill Bill: Vol. 1" src="http://cdn9.nflximg.net/webp/3419/3993419.webp"><a id="b060031236_0" class="bobbable popLink hideBobBoxshot playLink full" href="http://www.netflix.com/WiPlayer?movieid=60031236&amp;trkid=13462293&amp;tctx=2%2C3%2Cc43357f0-c453-4f5b-bb5b-f9afaadbb4c9-1811849" data-uitrack="60031236,13462293,2,3">&nbsp;</a></span></div>',
                    size: [size, size]
                });
                scrollItemViews.push(scrollItemView);
                this.carousel.subscribe(scrollItemView);
            }
        }.bind(this);
        this.carousel = new CarouselView(options);
        this.carouselModifier = new StateModifier({
            origin: [0, 0.3]
        });

        createScrollItemArray(100, 150);
        this.carousel.sequenceFrom(scrollItemViews);

        this.add(this.carouselModifier).add(this.carousel);
    }

    function _setListeners() {

        this._eventInput.on('fade', function() {
            this.carousel.setOptions({
                minOpacity: 0.5,
                maxOpacity: 1
            });
        }.bind(this));

        this._eventInput.on('depth', function() {
            this.depthCount = this.depthCount + 100;
            this.carousel.setOptions({maxDepth:this.depthCount});
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