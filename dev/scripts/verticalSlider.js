"use strict";

var CONSTANTS = require('./verticalSlider-constants');
// var IconController = require('./verticalSlider-iconController');
var ZIndexController = require('./verticalSlider-zindexController');
var VideoController = require('./verticalSlider-videoController');
var TabController = require('./verticalSlider-tabController');
var Slide = require('./verticalSlider-slide');
var Helper = require('./helper');

function VerticalSlider(options) {
    Helper.call(this, options);

    this._elem = options.elem;
    this._minMobileHeight = options.minMobileHeight;
    this._minDesktopHeight = options.minDesktopHeight;
    this._collapsedSlideHeightDesktop = options.collapsedSlideHeightDesktop;
    this._collapsedSlideHeightMobile = options.collapsedSlideHeightMobile;
    this._transitionDuration = options.transitionDuration / 2;

    this._onSliderReady = this._onSliderReady.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onSlideChangingState = this._onSlideChangingState.bind(this);
    this._onSlideChangedState = this._onSlideChangedState.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onMouseOut = this._onMouseOut.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onVideoIsLoaded = this._onVideoIsLoaded.bind(this);

    /*this._elem.addEventListener('slidechangingstate', this._onSlideChangingState);
    this._elem.addEventListener('slidechangedstate', this._onSlideChangedState);*/
    this._addListener(this._elem, 'slidechangingstate', this._onSlideChangingState);
    this._addListener(this._elem, 'slidechangedstate', this._onSlideChangedState);

    // window.addEventListener('resize', this._onResize);
    this._addListener(window, 'resize', this._onResize);

    this._init();
}

VerticalSlider.prototype = Object.create(Helper.prototype);
VerticalSlider.prototype.constructor = VerticalSlider;

VerticalSlider.prototype.remove = function() {
    this._destroyTabController();
    this._destroyZIndexController();
    this._destroyVideoController();
    this._destroySlides();

    Helper.prototype.remove.apply(this, arguments);
};

VerticalSlider.prototype._destroySlides = function() {
    if (this._slidesArr && this._slidesArr.length > 0) {
        for (var i = 0; i < this._slidesArr.length; i++) {
            this._slidesArr[i].remove();
        }
    }
};

VerticalSlider.prototype._destroyZIndexController = function() {
    if (this._zIndexController && this._zIndexController.remove) {
        this._zIndexController.remove();
    }
};

VerticalSlider.prototype._destroyVideoController = function() {
    if (this._videoController && this._videoController.remove) {
        this._videoController.remove();
    }
};

VerticalSlider.prototype._destroyTabController = function() {
    if (this._tabController && this._tabController.remove) {
        this._tabController.remove();
    }
};

VerticalSlider.prototype._waitUntilAllVideosAreLoaded = function() {
    if (this._allVideosAreLoadedCheck()) {
        this._sliderStartReactingOnMouse();
    } else {
        // this._elem.addEventListener('videoisloaded', this._onVideoIsLoaded);
        this._addListener(this._elem, 'videoisloaded', this._onVideoIsLoaded);
    }
};

VerticalSlider.prototype._allVideosAreLoadedCheck = function() {
    for (var i = 0; i < this._slidesArr.length; i++) {
        if (!this._slidesArr[i]._videoIsLoaded) return false;
    }

    // console.log('ALL VIDEOS ARE LOADED');
    return true;
};

VerticalSlider.prototype._onVideoIsLoaded = function(e) {
    // console.log('video is loaded');
    if (!this._allVideosAreLoadedCheck()) return;

    // this._elem.removeEventListener('videoisloaded', this._onVideoIsLoaded);
    this._removeListener(this._elem, 'videoisloaded', this._onVideoIsLoaded);

    this._sliderStartReactingOnMouse();
};

VerticalSlider.prototype._sliderStartReactingOnMouse = function() {
    // this._elem.addEventListener('mouseout', this._onMouseOut.bind(this));
    // this._elem.addEventListener('mouseover', this._onMouseOver.bind(this));
    this._addListener(this._elem, 'mouseout', this._onMouseOut);
    this._addListener(this._elem, 'mouseover', this._onMouseOver);
};

VerticalSlider.prototype._init = function() {
    // console.log('offsetWidth = ' + this._elem.offsetWidth);
    // console.log('window.innerWidth = ' + window.innerWidth);
    /*this._getOpenSlideBackground();
    setTimeout(this._getOpenSlideBackground.bind(this), 0);*/
    this._removeListener(this._elem, 'sliderready', this._onSliderReady);
    this._removeListener(this._elem, 'mousemove', this._onMouseMove);

    this._destroyTabController();
    this._destroyVideoController();
    this._destroyZIndexController();
    this._destroySlides();

    if (window.innerWidth < 800) {
        // console.log('Initializing MOBILE');
        // this._initMobile();
        this._initialisation = CONSTANTS.sliderInitalisation.mobile;
    } else {
        // console.log('Initializing DESKTOP');
        // this._initDesktop();
        this._initialisation = CONSTANTS.sliderInitalisation.desktop;
    }

    this._calculateValues();
    this._createSlides();

    this._zIndexController = new ZIndexController({
        slidesArr: this._slidesArr
    });
    this._tabController = new TabController({
        slidesArr: this._slidesArr,
        transitionDuration: this._transitionDuration
    });
    // this._iconController = '';

    if (this._initialisation === CONSTANTS.sliderInitalisation.desktop) {
        this._videoController = new VideoController({
            slidesArr: this._slidesArr
        });

        this._setSlidesToInitialDesktopState();
        this._waitUntilAllVideosAreLoaded();

    } else {
        this._videoController = {};
        this._setSlidesToInitialMobileState();
        this._sliderStartReactingOnMouse();
    }

    this._state = CONSTANTS.sliderStateVals.ready;
};

/*VerticalSlider.prototype._initDesktop = function() {
    this._initialisation = CONSTANTS.sliderInitalisation.desktop;
    this._setSlidesToInitialDesktopState();
};

VerticalSlider.prototype._initMobile = function() {
    this._initialisation = CONSTANTS.sliderInitalisation.mobile;
    this._setSlidesToInitialMobileState();
};*/

VerticalSlider.prototype._onResize = function() {
    if (this._initialisation === CONSTANTS.sliderInitalisation.desktop && this._elem.offsetWidth < 800) {
        this._init();
    } else if (this._initialisation === CONSTANTS.sliderInitalisation.mobile && this._elem.offsetWidth >= 800) {
        this._init();
    }
};

VerticalSlider.prototype._calculateValues = function() {
    this._mobileHeight = window.innerHeight - 85;
    if (this._mobileHeight < this._minMobileHeight) {
        this._mobileHeight = this._minMobileHeight;
    }
    this._desktopHeight = window.innerHeight - 98;
    if (this._desktopHeight < this._minDesktopHeight) {
        this._desktopHeight = this._minDesktopHeight;
    }

    this._height = this._initialisation === CONSTANTS.sliderInitalisation.mobile ? this._mobileHeight : this._desktopHeight;
    this._elem.style.height = this._height + 'px';
    // this._openSlideHeight = this._initialisation === CONSTANTS.sliderInitalisation.mobile ? this._openSlideHeightMobile : this._openSlideHeightDesktop;
    this._closedSlideHeight = this._height / 3;
    // this._collapsedSlideHeight = (this._height - this._openSlideHeight) / 2;
    this._openSlideHeight = this._initialisation === CONSTANTS.sliderInitalisation.mobile ? this._height - (this._collapsedSlideHeightMobile * 2) : this._height - (this._collapsedSlideHeightDesktop * 2);

    this._collapsedSlideHeight = this._initialisation === CONSTANTS.sliderInitalisation.mobile ? this._collapsedSlideHeightMobile : this._collapsedSlideHeightDesktop ;
};

VerticalSlider.prototype._createSlides = function() {

    this._slidesArr = [];

    var slideElemsArr = this._elem.querySelectorAll('.slide');

    for (var i = 0; i < slideElemsArr.length; i++) {
        var newSlide = new Slide({
            elem: slideElemsArr[i],
            transitionDuration: this._transitionDuration,
            initialZIndex: CONSTANTS.slideZIndexVals.low,
            position: i === 0 ? CONSTANTS.slidePositionVals.top : i === 1 ? CONSTANTS.slidePositionVals.middle : CONSTANTS.slidePositionVals.bottom
        });

        this._slidesArr.push(newSlide);
    }
};

VerticalSlider.prototype._setSlidesToInitialDesktopState = function() {
    for (var i = 0; i < this._slidesArr.length; i++) {
        this._slidesArr[i].changeStateWithoutTransition(CONSTANTS.slideStateVals.closed, this._closedSlideHeight);
    }
    this._zIndexController.resetIndexes();
};

VerticalSlider.prototype._setSlidesToInitialMobileState = function() {
    this._slidesArr[0].changeStateWithoutTransition(CONSTANTS.slideStateVals.collapsed, this._collapsedSlideHeight);
    this._slidesArr[1].changeStateWithoutTransition(CONSTANTS.slideStateVals.open, this._openSlideHeight);
    this._slidesArr[2].changeStateWithoutTransition(CONSTANTS.slideStateVals.collapsed, this._collapsedSlideHeight);
    this._zIndexController.resetIndexes();
};

VerticalSlider.prototype._onMouseOver = function(e) {
    var target = e.target;
    var previousTarget = e.relatedTarget;

    var currentSlideElem = target.closest('.slide');
    var currentSlide = this._getSlideByElem(currentSlideElem);
    var previousSlideElem = previousTarget? previousTarget.closest('.slide') : null;
    var previousSlide = this._getSlideByElem(previousSlideElem);

    if (!currentSlide || currentSlide === previousSlide) return;

    if (this._state === CONSTANTS.sliderStateVals.moving) {
        this._waitTillSliderReady(e.clientX, e.clientY);
    } else {
        this._openCurrentSlideCloseOthers(currentSlide);
    }
};

VerticalSlider.prototype._onMouseOut = function(e) {
    if (this._initialisation === CONSTANTS.sliderInitalisation.mobile) return;

    var target = e.target;
    var nextTarget = e.relatedTarget;

    var currentSlideElem = target.closest('.slide');
    var currentSlide = this._getSlideByElem(currentSlideElem);
    var nextSlideElem = nextTarget? nextTarget.closest('.slide') : null;
    var nextSlide = this._getSlideByElem(nextSlideElem);

    if (!currentSlide || nextSlide) return;

    if (this._state === CONSTANTS.sliderStateVals.moving) {
        this._waitTillSliderReady(e.clientX, e.clientY);
    } else {
        this._closeAllSlides();
    }
};

VerticalSlider.prototype._getSlideByElem = function(slideElem) {
    for (var i = 0; i < this._slidesArr.length; i++) {
        if (this._slidesArr[i]._elem === slideElem) {
            return this._slidesArr[i];
        }
    }

    return null;
};

VerticalSlider.prototype._openCurrentSlideCloseOthers = function(currentSlide) {

    for (var i = 0; i < this._slidesArr.length; i++) {
        if (this._slidesArr[i] === currentSlide) {
            if (this._slidesArr[i].getCurrentState() !== CONSTANTS.slideStateVals.open) {
                this._openSlide(this._slidesArr[i]);
            }
        } else {
            if (this._slidesArr[i].getCurrentState() !== CONSTANTS.slideStateVals.collapsed) {
                this._collapseSlide(this._slidesArr[i]);
            }
        }
    }
};

VerticalSlider.prototype._closeAllSlides = function() {

    for (var i = 0; i < this._slidesArr.length; i++) {
        if (this._slidesArr[i].getCurrentState() !== CONSTANTS.sliderStateVals.closed) {
            this._closeSlide(this._slidesArr[i]);
        }
    }
};

VerticalSlider.prototype._openSlide = function(slide) {
    slide.changeState(CONSTANTS.slideStateVals.open, this._openSlideHeight);
};

VerticalSlider.prototype._collapseSlide = function(slide) {
    slide.changeState(CONSTANTS.slideStateVals.collapsed, this._collapsedSlideHeight);
};

VerticalSlider.prototype._closeSlide = function(slide) {
    slide.changeState(CONSTANTS.slideStateVals.closed, this._closedSlideHeight);
};

VerticalSlider.prototype._onSlideChangingState = function(e) {
    /*console.log('caught _onSlideChangingState event');*/
    var target = e.target;
    var slide = this._getSlideByElem(target);

    this._state = CONSTANTS.sliderStateVals.moving;
    this._zIndexController.resetIndexes();
    this._tabController.resetTabsPosition();

    if (this._initialisation === CONSTANTS.sliderInitalisation.desktop) {

        this._tabController.addTransitionToAll();

        if (slide._videoState === CONSTANTS.videoStateVals.playing) {
            this._videoController.resetVideo(slide);
        }

        /*var slideStateInfo = slide.getStateInfo(e.detail.state);

        if (slideStateInfo.type === CONSTANTS.slideStateVals.transitionalBeforeBP) {
            this._iconController.moveIcon(slide);
        }*/
    }

};

VerticalSlider.prototype._onSlideChangedState = function(e) {
    /*console.log('caught _onSlideChangedState event');*/
    var target = e.target;
    var slideStateInfo;
    var slide = this._getSlideByElem(target);

    if (this._initialisation === CONSTANTS.sliderInitalisation.desktop) {
        // this._iconController.removeTransition(slide);

        if (e.detail.state === CONSTANTS.slideStateVals.open) {
            this._videoController.startVideo(slide);
        }
    }

    for (var i = 0; i < this._slidesArr.length; i++) {
        slideStateInfo = this._slidesArr[i].getStateInfo(this._slidesArr[i].getCurrentState());

        if (slideStateInfo.type !== CONSTANTS.slideStateVals.completed) return;
    }

    var widgetEvent = new CustomEvent("sliderready", {
        bubbles: true
    });

    this._state = CONSTANTS.sliderStateVals.ready;
    this._initialisation === CONSTANTS.sliderInitalisation.desktop ? this._tabController.removeTransitionFromAll() : false;
    this._elem.dispatchEvent(widgetEvent);
};

VerticalSlider.prototype._onMouseMove = function(e) {
    this._clientX = e.clientX;
    this._clientY = e.clientY;
};

VerticalSlider.prototype._onSliderReady = function(e) {
    // document.documentElement.removeEventListener('mousemove', this._onMouseMove);
    // this._elem.removeEventListener('sliderready', this._onSliderReady);
    this._removeListener(document.documentElement, 'mousemove', this._onMouseMove);
    this._removeListener(this._elem, 'sliderready', this._onSliderReady);

    var target = document.elementFromPoint(this._clientX, this._clientY);

    var currentSlideElem = target ? target.closest('.slide') : null;
    var currentSlide = this._getSlideByElem(currentSlideElem);

    if (currentSlide) {
        var currentSlideState = currentSlide.getCurrentState();

        if (currentSlideState !== CONSTANTS.slideStateVals.open) {
            this._openCurrentSlideCloseOthers(currentSlide);
        }

    } else {
        var firstSlideState = this._slidesArr[0].getCurrentState();

        if (firstSlideState !== CONSTANTS.slideStateVals.closed) {
            this._initialisation === CONSTANTS.sliderInitalisation.desktop ? this._closeAllSlides() : false;
        }
    }

    delete this._clientX;
    delete this._clientY;
};

VerticalSlider.prototype._waitTillSliderReady = function(clientX, clientY) {
    this._clientX = clientX;
    this._clientY = clientY;
    // document.documentElement.addEventListener('mousemove', this._onMouseMove);
    // this._elem.addEventListener('sliderready', this._onSliderReady);
    this._addListener(document.documentElement, 'mousemove', this._onMouseMove);
    this._addListener(this._elem, 'sliderready', this._onSliderReady);

};

module.exports = VerticalSlider;