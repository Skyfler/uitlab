"use strict";

var slideStateVals = {
    open: 'open',
    openingBeforeBP: 'opening-before-breakpoint',
    openingAfterBP: 'opening-after-breakpoint',

    closed: 'closed',
    closingBeforeBP: 'closing-before-breakpoint',
    closingAfterBP: 'closing-after-breakpoint',

    collapsed: 'collapsed',
    collapsingBeforeBP: 'collapsing-before-breakpoint',
    collapsingAfterBP: 'collapsing-after-breakpoint',

    completed: 'completed',
    transitionalBeforeBP: 'transitional-before-breakpoint',
    transitionalAfterBP: 'transitional-after-breakpoint'
};

var slideZIndexVals = {
    high: 3,
    medium: 2,
    low: 1
};

var slidePositionVals = {
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

var transitionVals = {
    height: 'height',
    boxShadow: 'box-shadow',
    backgroundColor: 'background-color',
    top: 'top',
    none: '',

    linear: 'linear'
};

var sliderStateVals = {
    ready: 'ready',
    moving: 'moving'
};

var tabPositionVals = {
    top: 'tab-top',
    bottom: 'tab-bottom'
};

var videoStateVals = {
    playing: 'playing',
    stoped: 'stoped'
};

var imgTopVals = {
    topCollapsed: 54,
    topClosed: 102,
    topOpen: 242,

    middleCollapsedOnTabBottom: 54,
    middleCollapsedOnTabTop: 6,
    middleClosed: 102,
    middleOpen: 250,

    bottomCollapsed: 6,
    bottomClosed: 104,
    bottomOpen: 242
};

var sliderInitalisation = {
    desktop: 'desktop',
    mobile: 'mobile'
};

/*
 ======================== VerticalSlider Constructor ========================
 */

function VerticalSlider(options) {
    this._elem = options.elem;
    this._minMobileHeight = options.minMobileHeight;
    this._minDesktopHeight = options.minDesktopHeight;
    this._collapsedSlideHeightDesktop = options.collapsedSlideHeightDesktop;
    this._collapsedSlideHeightMobile = options.collapsedSlideHeightMobile;
    this._transitionDuration = options.transitionDuration / 2;

    this._init.bind(this)();

    this._onSliderReady = this._onSliderReady.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);

    this._elem.addEventListener('slidechangingstate', this._onSlideChangingState.bind(this));
    this._elem.addEventListener('slidechangedstate', this._onSlideChangedState.bind(this));

    this._waitUntilAllVideosAreLoaded();

    window.addEventListener('resize', this._onResize.bind(this));
}

VerticalSlider.prototype._waitUntilAllVideosAreLoaded = function() {

    if (this._allVideosAreLoadedCheck()) {
        this._elem.addEventListener('mouseout', this._onMouseOut.bind(this));
        this._elem.addEventListener('mouseover', this._onMouseOver.bind(this));
    } else {
        this._elem.addEventListener('videoisloaded', this._onVideoIsLoaded.bind(this));
    }
};

VerticalSlider.prototype._onVideoIsLoaded = function(e) {

    // console.log('video is loaded');

    if (!this._allVideosAreLoadedCheck()) return;

    this._elem.removeEventListener('videoisloaded', this._onVideoIsLoaded.bind(this));

    this._elem.addEventListener('mouseout', this._onMouseOut.bind(this));
    this._elem.addEventListener('mouseover', this._onMouseOver.bind(this));

};

VerticalSlider.prototype._allVideosAreLoadedCheck = function() {
    for (var i = 0; i < this._slidesArr.length; i++) {
        if (!this._slidesArr[i]._videoIsLoaded) return false;
    }

    // console.log('ALL VIDEOS ARE LOADED');

    return true;
};

VerticalSlider.prototype._init = function() {
    // console.log('offsetWidth = ' + this._elem.offsetWidth);
    // console.log('window.innerWidth = ' + window.innerWidth);
    /*this._getOpenSlideBackground();
    setTimeout(this._getOpenSlideBackground.bind(this), 0);*/

    if (window.innerWidth < 800) {
        this._initMobile.bind(this)();
    } else {
        this._initDesktop.bind(this)();
    }
};

VerticalSlider.prototype._initDesktop = function() {
    // console.log('Initializing DESKTOP');
    this._elem.removeEventListener('sliderready', this._onSliderReady);
    this._elem.removeEventListener('mousemove', this._onMouseMove);

    this._initialisation = sliderInitalisation.desktop;

    this._calculateValues.bind(this)();
    this._createSlides.bind(this)();

    this._zIndexController = new ZIndexController({
        slidesArr: this._slidesArr
    });
    this._tabController = new TabController({
        slidesArr: this._slidesArr,
        transitionDuration: this._transitionDuration
    });
    // this._iconController = new IconController({
    //     slidesArr: this._slidesArr,
    //     transitionDuration: this._transitionDuration * 2
    // });
    this._iconController = '';
    this._videoController = new VideoController({
        slidesArr: this._slidesArr
    });

    this._setSlidesToInitialDesktopState.bind(this)();

    this._state = sliderStateVals.ready;
};

VerticalSlider.prototype._initMobile = function() {
    // console.log('Initializing MOBILE');
    this._elem.removeEventListener('sliderready', this._onSliderReady);
    this._elem.removeEventListener('mousemove', this._onMouseMove);

    this._initialisation = sliderInitalisation.mobile;

    this._calculateValues.bind(this)();
    this._createSlides.bind(this)();

    this._zIndexController = new ZIndexController({
        slidesArr: this._slidesArr
    });
    this._tabController = new TabController({
        slidesArr: this._slidesArr,
        transitionDuration: this._transitionDuration
    });
    this._iconController = '';
    this._videoController = new VideoController({
        slidesArr: this._slidesArr
    });

    this._setSlidesToInitialMobileState.bind(this)();

    this._state = sliderStateVals.ready;
};

VerticalSlider.prototype._onResize = function() {
    if (this._initialisation === sliderInitalisation.desktop && this._elem.offsetWidth < 800) {
        this._initMobile.bind(this)();
    } else if (this._initialisation === sliderInitalisation.mobile && this._elem.offsetWidth >= 800) {
        this._initDesktop.bind(this)();
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

    this._height = this._initialisation === sliderInitalisation.mobile ? this._mobileHeight : this._desktopHeight;
    this._elem.style.height = this._height + 'px';
    // this._openSlideHeight = this._initialisation === sliderInitalisation.mobile ? this._openSlideHeightMobile : this._openSlideHeightDesktop;
    this._closedSlideHeight = this._height / 3;
    // this._collapsedSlideHeight = (this._height - this._openSlideHeight) / 2;
    this._openSlideHeight = this._initialisation === sliderInitalisation.mobile ? this._height - (this._collapsedSlideHeightMobile * 2) : this._height - (this._collapsedSlideHeightDesktop * 2);

    this._collapsedSlideHeight = this._initialisation === sliderInitalisation.mobile ? this._collapsedSlideHeightMobile : this._collapsedSlideHeightDesktop ;
};

VerticalSlider.prototype._createSlides = function() {
    this._slidesArr = [];

    var slideElemsArr = this._elem.querySelectorAll('.slide');

    for (var i = 0; i < slideElemsArr.length; i++) {
        var newSlide = new Slide({
            elem: slideElemsArr[i],
            transitionDuration: this._transitionDuration,
            initialZIndex: slideZIndexVals.low,
            position: i === 0 ? slidePositionVals.top : i === 1 ? slidePositionVals.middle : slidePositionVals.bottom
        });

        this._slidesArr.push(newSlide);
    }
};

VerticalSlider.prototype._setSlidesToInitialDesktopState = function() {
    for (var i = 0; i < this._slidesArr.length; i++) {
        this._slidesArr[i].changeStateWithoutTransition(slideStateVals.closed, this._closedSlideHeight);
    }
    this._zIndexController.resetIndexes();
};

VerticalSlider.prototype._setSlidesToInitialMobileState = function() {
    this._slidesArr[0].changeStateWithoutTransition(slideStateVals.collapsed, this._collapsedSlideHeight);
    this._slidesArr[1].changeStateWithoutTransition(slideStateVals.open, this._openSlideHeight);
    this._slidesArr[2].changeStateWithoutTransition(slideStateVals.collapsed, this._collapsedSlideHeight);
    this._zIndexController.resetIndexes();
};

VerticalSlider.prototype._onMouseOver = function(e) {
    var target = e.target;
    var previousTarget = e.relatedTarget;

    var currentSlideElem = target.closest('.slide');
    var currentSlide = this._getSlideByElem.bind(this)(currentSlideElem);
    var previousSlideElem = previousTarget? previousTarget.closest('.slide') : null;
    var previousSlide = this._getSlideByElem.bind(this)(previousSlideElem);

    if (!currentSlide || currentSlide === previousSlide) return;

    if (this._state === sliderStateVals.moving) {
        this._waitTillSliderReady(e.clientX, e.clientY);
    } else {
        this._openCurrentSlideCloseOthers.bind(this)(currentSlide);
    }
};

VerticalSlider.prototype._onMouseOut = function(e) {
    if (this._initialisation === sliderInitalisation.mobile) return;

    var target = e.target;
    var nextTarget = e.relatedTarget;

    var currentSlideElem = target.closest('.slide');
    var currentSlide = this._getSlideByElem.bind(this)(currentSlideElem);
    var nextSlideElem = nextTarget? nextTarget.closest('.slide') : null;
    var nextSlide = this._getSlideByElem.bind(this)(nextSlideElem);

    if (!currentSlide || nextSlide) return;

    if (this._state === sliderStateVals.moving) {
        this._waitTillSliderReady(e.clientX, e.clientY);
    } else {
        this._closeAllSlides.bind(this)();
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
            if (this._slidesArr[i].getCurrentState() !== slideStateVals.open) {
                this._openSlide.bind(this)(this._slidesArr[i]);
            }
        } else {
            if (this._slidesArr[i].getCurrentState() !== slideStateVals.collapsed) {
                this._collapseSlide.bind(this)(this._slidesArr[i]);
            }
        }
    }
};

VerticalSlider.prototype._closeAllSlides = function() {

    for (var i = 0; i < this._slidesArr.length; i++) {
        if (this._slidesArr[i].getCurrentState() !== sliderStateVals.closed) {
            this._closeSlide.bind(this)(this._slidesArr[i]);
        }
    }
};

VerticalSlider.prototype._openSlide = function(slide) {
    slide.changeState(slideStateVals.open, this._openSlideHeight);
};

VerticalSlider.prototype._collapseSlide = function(slide) {
    slide.changeState(slideStateVals.collapsed, this._collapsedSlideHeight);
};

VerticalSlider.prototype._closeSlide = function(slide) {
    slide.changeState(slideStateVals.closed, this._closedSlideHeight);
};

VerticalSlider.prototype._onSlideChangingState = function(e) {
    /*console.log('caught _onSlideChangingState event');*/
    var target = e.target;
    var slide = this._getSlideByElem.bind(this)(target);

    this._state = sliderStateVals.moving;
    this._zIndexController.resetIndexes();
    this._tabController.resetTabsPosition();

    if (this._initialisation === sliderInitalisation.desktop) {

        this._tabController.addTransitionToAll();

        if (slide._videoState === videoStateVals.playing) {
            this._videoController.resetVideo(slide);
        }

        var slideStateInfo = slide.getStateInfo(e.detail.state);

        if (slideStateInfo.type === slideStateVals.transitionalBeforeBP) {
            // this._iconController.moveIcon(slide);
        }
    }

};

VerticalSlider.prototype._onSlideChangedState = function(e) {
    /*console.log('caught _onSlideChangedState event');*/
    var target = e.target;
    var slideStateInfo;
    var slide = this._getSlideByElem.bind(this)(target);

    if (this._initialisation === sliderInitalisation.desktop) {
        // this._iconController.removeTransition(slide);

        if (e.detail.state === slideStateVals.open) {
            this._videoController.startVideo(slide);
        }
    }

    for (var i = 0; i < this._slidesArr.length; i++) {
        slideStateInfo = this._slidesArr[i].getStateInfo(this._slidesArr[i].getCurrentState());

        if (slideStateInfo.type !== slideStateVals.completed) return;
    }

    var widgetEvent = new CustomEvent("sliderready", {
        bubbles: true
    });

    this._state = sliderStateVals.ready;
    this._initialisation === sliderInitalisation.desktop ? this._tabController.removeTransitionFromAll() : false;
    this._elem.dispatchEvent(widgetEvent);
};

VerticalSlider.prototype._onMouseMove = function(e) {
    this._clientX = e.clientX;
    this._clientY = e.clientY;
};

VerticalSlider.prototype._onSliderReady = function(e) {
    document.documentElement.removeEventListener('mousemove', this._onMouseMove);
    this._elem.removeEventListener('sliderready', this._onSliderReady);

    var target = document.elementFromPoint(this._clientX, this._clientY);

    var currentSlideElem = target ? target.closest('.slide') : null;
    var currentSlide = this._getSlideByElem.bind(this)(currentSlideElem);

    if (currentSlide) {
        this._openCurrentSlideCloseOthers.bind(this)(currentSlide);
    } else {
        this._initialisation === sliderInitalisation.desktop ? this._closeAllSlides.bind(this)() : false;
    }

    delete this._clientX;
    delete this._clientY;
};

VerticalSlider.prototype._waitTillSliderReady = function(clientX, clientY) {
    this._clientX = clientX;
    this._clientY = clientY;
    document.documentElement.addEventListener('mousemove', this._onMouseMove);
    this._elem.addEventListener('sliderready', this._onSliderReady);
};

/*
======================== Slide Constructor ========================
*/

function Slide(options) {
    this._elem = options.elem;
    this._transitionDuration = options.transitionDuration;
    this._currentZIndex = options.initialZIndex;
    this._position = options.position;
    this._bgElem = this._elem.querySelector('.bg_layer');
    this._topTab = this._elem.querySelector('.top-tab');

    this.getCurrentState = this.getCurrentState.bind(this);
    this.getPreviousState = this.getPreviousState.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeStateWithoutTransition = this.changeStateWithoutTransition.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this.zIndex = this.zIndex.bind(this);
    this.getPosition = this.getPosition.bind(this);

    /*this._getOpenSlideBackground();
    setTimeout(this._getOpenSlideBackground.bind(this), 0);*/

    this.zIndex(this._currentZIndex);
    this._elem.style.height = this._currentHeight + 'px';
}

Slide.prototype._addTransition = function() {
    this._elem.addEventListener('transitionend', this._onTransitionEnd);

    this._elem.style.transitionTimingFunction = transitionVals.linear;
    this._elem.style.transitionProperty = [transitionVals.height, transitionVals.boxShadow, transitionVals.backgroundColor].join(', ');
    this._elem.style.transitionDuration = [this._transitionDuration + 'ms', this._transitionDuration + 'ms', (this._transitionDuration * 2) + 'ms'].join(', ');
    this._elem.style.transitionDelay = 0 + 'ms';
};

Slide.prototype._setBackgroundOnOpeningSlide = function() {

    this._getOpenSlideBackground();

    if (this._openSlideBackground) {
        if (this._bgElem) {
            this._bgElem.style.background = this._openSlideBackground;
            if (this._topTab) {
                this._topTab.style.background = this._openSlideBackground;
            }
        }
    }
};

Slide.prototype._removeBackgroundFromSlide = function() {
    if (this._bgElem) {
        this._bgElem.style.background = '';
        if (this._topTab) {
            this._topTab.style.background = '';
        }
    }
};

Slide.prototype._removeTransition = function() {
    this._elem.removeEventListener('transitionend', this._onTransitionEnd);

    this._elem.style.transitionTimingFunction = '';
    this._elem.style.transitionProperty = '';
    this._elem.style.transitionDuration = '';
    this._elem.style.transitionDelay = '';
};

Slide.prototype._onTransitionEnd = function(e) {
    var target = e.target;
    var prop = e.propertyName;

    if (!prop || target !== this._elem || prop !== transitionVals.height) return;

    var stateInfo = this.getStateInfo(this._state);

    this._state = this._nextState;
    this._changeStateClass.bind(this)();

    var widgetEvent;

    if (stateInfo.type === slideStateVals.transitionalBeforeBP) {
        widgetEvent = new CustomEvent("slidechangingstate", {
            bubbles: true,
            detail: {
                state: this._state
            }
        });

        this._nextState = stateInfo.finalState;

        this._elem.style.height = this._finalHeight + 'px';
    } else if (stateInfo.type === slideStateVals.transitionalAfterBP) {

        delete this._nextState;

        this._currentHeight = this._finalHeight;
        delete this._finalHeight;
        delete this._previousState;

        widgetEvent = new CustomEvent("slidechangedstate", {
            bubbles: true,
            detail: {
                state: this._state
            }
        });

        this._removeTransition.bind(this)();

    }

    this._elem.dispatchEvent(widgetEvent);
};

Slide.prototype.changeState = function(newState, finalSlideHeight) {
    this._finalHeight = finalSlideHeight;
    var stateInfo = this.getStateInfo(newState);
    var newSlideHeight = this._currentHeight + (this._finalHeight - this._currentHeight) / 2;

    this._addTransition.bind(this)();

    this._previousState = this._state;

    if (this._previousState === slideStateVals.open) {
        this._removeBackgroundFromSlide();
    } else if (stateInfo.finalState === slideStateVals.open) {
        this._setBackgroundOnOpeningSlide();
    }

    this._state = stateInfo.transitionalStateBeforeBP;
    this._changeStateClass.bind(this)();
    this._nextState = stateInfo.transitionalStateAfterBP;

    var widgetEvent = new CustomEvent("slidechangingstate", {
        bubbles: true,
        detail: {
            state: this._state
        }
    });

    this._elem.style.height = newSlideHeight + 'px';
    this._elem.dispatchEvent(widgetEvent);
};

Slide.prototype.changeStateWithoutTransition = function(newState, finalSlideHeight) {

    var stateInfo = this.getStateInfo(newState);

    if (this._previousState === slideStateVals.open) {
        this._removeBackgroundFromSlide();
    } else if (stateInfo.finalState === slideStateVals.open) {
        this._setBackgroundOnOpeningSlide();
    }

    this._currentHeight = finalSlideHeight;
    this._state = newState;
    this._changeStateClass.bind(this)();

    this._elem.style.height = finalSlideHeight + 'px';
};

Slide.prototype._getOpenSlideBackground = function() {
    var videoElem = this._elem.querySelector('video');

    var canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    var ctx = canvas.getContext('2d');

    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);

    var x = 0;
    var y = 0;

    var imgData = ctx.getImageData(x, y, 1, 1);
    var red = imgData.data[0];
    var green = imgData.data[1];
    var blue = imgData.data[2];
    var alpha = imgData.data[3];

    if (red === 0 && green === 0 && blue === 0 && alpha === 0) {
        this._openSlideBackground = '';
    } else {
        this._openSlideBackground = 'rgba(' + red + ", " + green + ", " + blue + ", " + alpha + ')';
    }

    // console.log(this._openSlideBackground);
};

Slide.prototype._changeStateClass = function() {
    if (this._elem.classList.contains(slideStateVals.closed)) {
        this._elem.classList.remove(slideStateVals.closed);
    }
    if (this._elem.classList.contains(slideStateVals.closingBeforeBP)) {
        this._elem.classList.remove(slideStateVals.closingBeforeBP);
    }
    if (this._elem.classList.contains(slideStateVals.closingAfterBP)) {
        this._elem.classList.remove(slideStateVals.closingAfterBP);
    }
    if (this._elem.classList.contains(slideStateVals.open)) {
        this._elem.classList.remove(slideStateVals.open);
    }
    if (this._elem.classList.contains(slideStateVals.openingBeforeBP)) {
        this._elem.classList.remove(slideStateVals.openingBeforeBP);
    }
    if (this._elem.classList.contains(slideStateVals.openingAfterBP)) {
        this._elem.classList.remove(slideStateVals.openingAfterBP);
    }
    if (this._elem.classList.contains(slideStateVals.collapsed)) {
        this._elem.classList.remove(slideStateVals.collapsed);
    }
    if (this._elem.classList.contains(slideStateVals.collapsingBeforeBP)) {
        this._elem.classList.remove(slideStateVals.collapsingBeforeBP);
    }
    if (this._elem.classList.contains(slideStateVals.collapsingAfterBP)) {
        this._elem.classList.remove(slideStateVals.collapsingAfterBP);
    }

    this._elem.classList.add(this._state);
};

Slide.prototype.getStateInfo = function(state) {
    var dataObj = {};

    switch (state) {

        case slideStateVals.closed:
            dataObj.type = slideStateVals.completed;
        case slideStateVals.closingBeforeBP:
            dataObj.type = dataObj.type || slideStateVals.transitionalBeforeBP;
        case slideStateVals.closingAfterBP:
            dataObj.type = dataObj.type || slideStateVals.transitionalAfterBP;
            dataObj.finalState = slideStateVals.closed;
            dataObj.transitionalStateBeforeBP = slideStateVals.closingBeforeBP;
            dataObj.transitionalStateAfterBP = slideStateVals.closingAfterBP;
            break;

        case slideStateVals.open:
            dataObj.type = slideStateVals.completed;
        case slideStateVals.openingBeforeBP:
            dataObj.type = dataObj.type || slideStateVals.transitionalBeforeBP;
        case slideStateVals.openingAfterBP:
            dataObj.type = dataObj.type || slideStateVals.transitionalAfterBP;
            dataObj.finalState = slideStateVals.open;
            dataObj.transitionalStateBeforeBP = slideStateVals.openingBeforeBP;
            dataObj.transitionalStateAfterBP = slideStateVals.openingAfterBP;
            break;

        case slideStateVals.collapsed:
            dataObj.type = slideStateVals.completed;
        case slideStateVals.collapsingBeforeBP:
            dataObj.type = dataObj.type || slideStateVals.transitionalBeforeBP;
        case slideStateVals.collapsingAfterBP:
            dataObj.type = dataObj.type || slideStateVals.transitionalAfterBP;
            dataObj.finalState = slideStateVals.collapsed;
            dataObj.transitionalStateBeforeBP = slideStateVals.collapsingBeforeBP;
            dataObj.transitionalStateAfterBP = slideStateVals.collapsingAfterBP;
            break;

    }

    // console.dir(dataObj);
    return dataObj;
};

Slide.prototype.getCurrentState = function() {
    return this._state;
};

Slide.prototype.getPreviousState = function() {
    return this._previousState;
};

Slide.prototype.zIndex = function(zIndex) {
    if (zIndex) {
        this._elem.style.zIndex = zIndex;
        this._currentZIndex = zIndex;
    } else {
        return this._currentZIndex;
    }
};

Slide.prototype.getPosition = function() {
    return this._position;
};

/*
 ======================== ZIndexController Constructor ========================
 */

function ZIndexController(options) {
    this._slidesArr = options.slidesArr;

    this.resetIndexes = this.resetIndexes.bind(this);
}

ZIndexController.prototype.resetIndexes = function() {

    this._refreshSlidesInfo.bind(this)();

    if (this._checkAllPreviouslyClosed.bind(this)() || !this._checkTransitionBeforeBP.bind(this)()) {

        if (this._checkTopOpens.bind(this)()) {
            this._setLowMediumHighIndex.bind(this)();

        } else if(this._checkMiddleOpens.bind(this)()) {
            this._setHighLowHighIndex.bind(this)();

        } else if(this._checkBottomOpens.bind(this)()) {
            this._setHighMediumLowIndex.bind(this)();

        }

    }

};

ZIndexController.prototype._refreshSlidesInfo = function() {
    this._slides = {};

    for (var i = 0; i < this._slidesArr.length; i++) {
        var position = this._slidesArr[i].getPosition();
        this._slides[position] = {};
        this._slides[position].slide = this._slidesArr[i];
        this._slides[position].state = this._slidesArr[i].getCurrentState();
        this._slides[position].stateInfo = this._slidesArr[i].getStateInfo(this._slides[position].state);
        this._slides[position].previousState = this._slidesArr[i].getPreviousState();
    }
};

ZIndexController.prototype._setHighMediumLowIndex = function() {
    /*
     * */
    this._slides[slidePositionVals.top].slide.zIndex(slideZIndexVals.high);
    this._slides[slidePositionVals.middle].slide.zIndex(slideZIndexVals.medium);
    this._slides[slidePositionVals.bottom].slide.zIndex(slideZIndexVals.low);
};

ZIndexController.prototype._setHighLowHighIndex = function() {
    /*
     * */
    this._slides[slidePositionVals.top].slide.zIndex(slideZIndexVals.high);
    this._slides[slidePositionVals.middle].slide.zIndex(slideZIndexVals.low);
    this._slides[slidePositionVals.bottom].slide.zIndex(slideZIndexVals.high);
};

ZIndexController.prototype._setLowMediumHighIndex = function() {
    /*
     * */
    this._slides[slidePositionVals.top].slide.zIndex(slideZIndexVals.low);
    this._slides[slidePositionVals.middle].slide.zIndex(slideZIndexVals.medium);
    this._slides[slidePositionVals.bottom].slide.zIndex(slideZIndexVals.high);
};


ZIndexController.prototype._checkAllPreviouslyClosed = function() {
    return this._slides[slidePositionVals.top].previousState === slideStateVals.closed &&
        this._slides[slidePositionVals.middle].previousState === slideStateVals.closed &&
        this._slides[slidePositionVals.bottom].previousState === slideStateVals.closed;
};

ZIndexController.prototype._checkAllWillBeClosed = function() {
    return this._slides[slidePositionVals.top].stateInfo.finalState === slideStateVals.closed &&
        this._slides[slidePositionVals.middle].stateInfo.finalState === slideStateVals.closed &&
        this._slides[slidePositionVals.bottom].stateInfo.finalState === slideStateVals.closed;
};

ZIndexController.prototype._checkTopOpens = function() {
    return this._slides[slidePositionVals.top].stateInfo.finalState === slideStateVals.open
};

ZIndexController.prototype._checkMiddleOpens = function() {
    return this._slides[slidePositionVals.middle].stateInfo.finalState === slideStateVals.open
};

ZIndexController.prototype._checkBottomOpens = function() {
    return this._slides[slidePositionVals.bottom].stateInfo.finalState === slideStateVals.open
};

ZIndexController.prototype._checkTopCollapses = function() {
    return this._slides[slidePositionVals.top].stateInfo.finalState === slideStateVals.collapsed
};

ZIndexController.prototype._checkMiddleCollapses = function() {
    return this._slides[slidePositionVals.middle].stateInfo.finalState === slideStateVals.collapsed
};

ZIndexController.prototype._checkBottomCollapses = function() {
    return this._slides[slidePositionVals.bottom].stateInfo.finalState === slideStateVals.collapsed
};

ZIndexController.prototype._checkTransitionBeforeBP = function() {
    return this._slides[slidePositionVals.top].stateInfo.type === slideStateVals.transitionalBeforeBP ||
        this._slides[slidePositionVals.middle].stateInfo.type === slideStateVals.transitionalBeforeBP ||
        this._slides[slidePositionVals.bottom].stateInfo.type === slideStateVals.transitionalBeforeBP;
};

/*
 ======================== TabController Constructor ========================
 */

function TabController(options) {
    this._slidesArr = options.slidesArr;
    this._transitionDuration = options.transitionDuration;

    this.resetTabsPosition = this.resetTabsPosition.bind(this);
    this.addTransitionToAll = this.addTransitionToAll.bind(this);
    this.removeTransitionFromAll = this.removeTransitionFromAll.bind(this);

    this._refreshSlidesInfo.bind(this)();
}

TabController.prototype.resetTabsPosition = function() {

    this._refreshSlidesInfo.bind(this)();

    if (this._checkAllPreviouslyClosed.bind(this)()) {

        if (this._checkTopOpens.bind(this)()) {
            this._setTabPositionsBottomTopTop.bind(this)();

        } else if(this._checkMiddleOpens.bind(this)()) {
            this._setTabPositionsBottomTopTop.bind(this)();

        } else if(this._checkBottomOpens.bind(this)()) {
            this._setTabPositionsBottomBottomTop.bind(this)();

        }

    } else {

        if (this._checkMiddleOpens.bind(this)() && this._checkTopCollapses.bind(this)()) {
            this._setTabPositionsBottomTopTop.bind(this)();
            // console.log('middle opens & top collapses');

        } else if (this._checkMiddleOpens.bind(this)() && this._checkBottomCollapses.bind(this)()) {
            this._setTabPositionsBottomBottomTop.bind(this)();
            // console.log('middle opens & bottom collapses');

        } else if (this._checkBottomOpens.bind(this)() && this._checkMiddleCollapses.bind(this)()) {
            this._setTabPositionsBottomBottomTop.bind(this)();
            // console.log('bottom opens & middle collapses');

        } else if (this._checkTopOpens.bind(this)() && this._checkMiddleCollapses.bind(this)()) {
            this._setTabPositionsBottomTopTop.bind(this)();
            // console.log('top opens & middle collapses');

        } else if (this._checkTopOpens.bind(this)() && this._checkBottomCollapses.bind(this)()) {
            this._setTabPositionsBottomTopTop.bind(this)();

        } else  if (this._checkBottomOpens.bind(this)() && this._checkTopCollapses.bind(this)()) {
            this._setTabPositionsBottomBottomTop.bind(this)();

        }

    }

};

TabController.prototype._refreshSlidesInfo = function() {
    this._slides = {};

    for (var i = 0; i < this._slidesArr.length; i++) {
        var position = this._slidesArr[i].getPosition();
        this._slides[position] = {};
        this._slides[position].slide = this._slidesArr[i];
        this._slides[position].state = this._slidesArr[i].getCurrentState();
        this._slides[position].stateInfo = this._slidesArr[i].getStateInfo(this._slides[position].state);
        this._slides[position].previousState = this._slidesArr[i].getPreviousState();
        if (!this._slidesArr[i]._tabPosition) {
            if (i === 2) {
                this._setTabPositionTop(this._slides[position].slide);
            } else {
                this._setTabPositionBottom(this._slides[position].slide);
            }

        }
        this._slides[position].tabs = this._getTabs(this._slides[position].slide._elem);
    }
};

TabController.prototype._getTabs = function(slideElem) {
    return slideElem.querySelectorAll('.tab');
};

TabController.prototype._setTabPositionsBottomBottomTop = function() {
    this._setTabPositionBottom.bind(this)(this._slides[slidePositionVals.top].slide);
    this._setTabPositionBottom.bind(this)(this._slides[slidePositionVals.middle].slide);
    this._setTabPositionTop.bind(this)(this._slides[slidePositionVals.bottom].slide);
};

TabController.prototype._setTabPositionsBottomTopTop = function() {
    this._setTabPositionBottom.bind(this)(this._slides[slidePositionVals.top].slide);
    this._setTabPositionTop.bind(this)(this._slides[slidePositionVals.middle].slide);
    this._setTabPositionTop.bind(this)(this._slides[slidePositionVals.bottom].slide);
};

TabController.prototype._setTabPositionTop = function(slide) {
    slide._tabPosition = tabPositionVals.top;
    this._removeTabPositionClasses(slide);
    slide._elem.classList.add(tabPositionVals.top);
};

TabController.prototype._setTabPositionBottom = function(slide) {
    slide._tabPosition = tabPositionVals.bottom;
    this._removeTabPositionClasses(slide);
    slide._elem.classList.add(tabPositionVals.bottom);
};

TabController.prototype._removeTabPositionClasses = function(slide) {
    if (slide._elem.classList.contains(tabPositionVals.top)) {
        slide._elem.classList.remove(tabPositionVals.top);
    }
    if (slide._elem.classList.contains(tabPositionVals.bottom)) {
        slide._elem.classList.remove(tabPositionVals.bottom);
    }
};

TabController.prototype._checkAllPreviouslyClosed = function() {
    return this._slides[slidePositionVals.top].previousState === slideStateVals.closed &&
        this._slides[slidePositionVals.middle].previousState === slideStateVals.closed &&
        this._slides[slidePositionVals.bottom].previousState === slideStateVals.closed;
};

TabController.prototype._checkAllWillBeClosed = function() {
    return this._slides[slidePositionVals.top].stateInfo.finalState === slideStateVals.closed &&
        this._slides[slidePositionVals.middle].stateInfo.finalState === slideStateVals.closed &&
        this._slides[slidePositionVals.bottom].stateInfo.finalState === slideStateVals.closed;
};

TabController.prototype._checkTopOpens = function() {
    return this._slides[slidePositionVals.top].stateInfo.finalState === slideStateVals.open &&
        this._slides[slidePositionVals.top].stateInfo.type !== slideStateVals.completed;
};

TabController.prototype._checkMiddleOpens = function() {
    return this._slides[slidePositionVals.middle].stateInfo.finalState === slideStateVals.open &&
        this._slides[slidePositionVals.middle].stateInfo.type !== slideStateVals.completed;
};

TabController.prototype._checkBottomOpens = function() {
    return this._slides[slidePositionVals.bottom].stateInfo.finalState === slideStateVals.open &&
        this._slides[slidePositionVals.bottom].stateInfo.type !== slideStateVals.completed;
};

TabController.prototype._checkTopCollapses = function() {
    return this._slides[slidePositionVals.top].stateInfo.finalState === slideStateVals.collapsed &&
        this._slides[slidePositionVals.top].stateInfo.type !== slideStateVals.completed;
};

TabController.prototype._checkMiddleCollapses = function() {
    return this._slides[slidePositionVals.middle].stateInfo.finalState === slideStateVals.collapsed &&
        this._slides[slidePositionVals.middle].stateInfo.type !== slideStateVals.completed;
};

TabController.prototype._checkBottomCollapses = function() {
    return this._slides[slidePositionVals.bottom].stateInfo.finalState === slideStateVals.collapsed &&
        this._slides[slidePositionVals.bottom].stateInfo.type !== slideStateVals.completed;
};

TabController.prototype._checkTransitionBeforeBP = function() {
    return this._slides[slidePositionVals.top].stateInfo.type === slideStateVals.transitionalBeforeBP ||
        this._slides[slidePositionVals.middle].stateInfo.type === slideStateVals.transitionalBeforeBP ||
        this._slides[slidePositionVals.bottom].stateInfo.type === slideStateVals.transitionalBeforeBP;
};

TabController.prototype._addTransitionBoxShadowBackground = function(tab) {
    tab.style.transitionTimingFunction = transitionVals.linear;
    tab.style.transitionProperty = [transitionVals.boxShadow, transitionVals.backgroundColor].join(', ');
    tab.style.transitionDuration = [this._transitionDuration + 'ms', (this._transitionDuration * 2) + 'ms'].join(', ');
    tab.style.transitionDelay = 0 + 'ms';
};

TabController.prototype._addTransitionBoxShadowTopBackground = function(tab) {
    tab.style.transitionTimingFunction = transitionVals.linear;
    tab.style.transitionProperty = [transitionVals.boxShadow, transitionVals.backgroundColor].join(', ');
    tab.style.transitionDuration = [this._transitionDuration + 'ms', this._transitionDuration + 'ms', (this._transitionDuration * 2) + 'ms'].join(', ');
    tab.style.transitionDelay = 0 + 'ms';
};

TabController.prototype.addTransitionToAll = function() {
    for (var i = 0; i < this._slides[slidePositionVals.top].tabs.length; i++) {
        this._addTransitionBoxShadowBackground(this._slides[slidePositionVals.top].tabs[i]);
    }
    for (i = 0; i < this._slides[slidePositionVals.middle].tabs.length; i++) {
        this._addTransitionBoxShadowBackground(this._slides[slidePositionVals.middle].tabs[i]);
    }
    for (i = 0; i < this._slides[slidePositionVals.bottom].tabs.length; i++) {
        this._addTransitionBoxShadowBackground(this._slides[slidePositionVals.bottom].tabs[i]);
    }
};

TabController.prototype.removeTransitionFromAll = function() {
    for (var i = 0; i < this._slides[slidePositionVals.top].tabs.length; i++) {
        this._removeTransition(this._slides[slidePositionVals.top].tabs[i]);
    }
    for (i = 0; i < this._slides[slidePositionVals.middle].tabs.length; i++) {
        this._removeTransition(this._slides[slidePositionVals.middle].tabs[i]);
    }
    for (i = 0; i < this._slides[slidePositionVals.bottom].tabs.length; i++) {
        this._removeTransition(this._slides[slidePositionVals.bottom].tabs[i]);
    }
};

TabController.prototype._removeTransition = function(tab) {
    tab.style.transitionTimingFunction = '';
    tab.style.transitionProperty = '';
    tab.style.transitionDuration = '';
    tab.style.transitionDelay = '';
};

/*
 ======================== VideoController Constructor ========================
 */

function VideoController(options) {
    this._slidesArr = options.slidesArr;

    this._init.bind(this)();
}

VideoController.prototype._init = function() {
    for (var i = 0; i < this._slidesArr.length; i ++) {
        this._slidesArr[i]._videoElem = this._slidesArr[i]._elem.querySelector('video');
        if (this._slidesArr[i]._videoElem.readyState === 4) {
            this._onVideoLoaded.bind(this._slidesArr[i])();
        } else {
            this._slidesArr[i]._videoElem.addEventListener('loadeddata', this._onVideoLoaded.bind(this._slidesArr[i]));
        }
        this._slidesArr[i]._videoElem.addEventListener('ended', this._onVideoEnd.bind(this._slidesArr[i]));

        this._slidesArr[i]._videoState = videoStateVals.stoped;
    }
};

VideoController.prototype._onVideoLoaded = function() {
    this._videoIsLoaded = true;

    var widgetEvent = new CustomEvent("videoisloaded", {
        bubbles: true
    });

    this._elem.dispatchEvent(widgetEvent);
};

VideoController.prototype._onVideoEnd = function() {
    this._videoElem.play();
};

VideoController.prototype.startVideo = function(slide) {
    slide._videoState = videoStateVals.playing;

    slide._videoElem.play();
};

VideoController.prototype.resetVideo = function(slide) {
    slide._videoState = videoStateVals.stoped;

    slide._videoElem.pause();
    slide._videoElem.currentTime = 0;
};

/*
 ======================== IconController Constructor ========================
 */

function IconController(options) {
    this._slidesArr = options.slidesArr;
    this._transitionDuration = options.transitionDuration;

    this._getIcons.bind(this)();
    this._refreshSlidesInfo.bind(this)();
    this._setAllClosed.bind(this)();

    this.moveIcon = this.moveIcon.bind(this);
}

IconController.prototype._getIcons = function() {
    for (var i = 0; i < this._slidesArr.length; i ++) {
        this._slidesArr[i]._iconElem = this._slidesArr[i]._elem.querySelector('.img');
    }
};

IconController.prototype._refreshSlidesInfo = function() {
    this._slides = {};

    for (var i = 0; i < this._slidesArr.length; i++) {
        var position = this._slidesArr[i].getPosition();
        this._slides[position] = {};
        this._slides[position].slide = this._slidesArr[i];
        this._slides[position].iconElem = this._slidesArr[i]._iconElem;
    }
};

IconController.prototype._setAllClosed =  function() {
    this._slides[slidePositionVals.top].iconElem.style.top = imgTopVals.topClosed + 'px';
    this._slides[slidePositionVals.middle].iconElem.style.top = imgTopVals.middleClosed + 'px';
    this._slides[slidePositionVals.bottom].iconElem.style.top = imgTopVals.bottomClosed + 'px';
};

IconController.prototype._addTransitionTop = function(icon) {
    icon.style.transitionTimingFunction = transitionVals.linear;
    icon.style.transitionProperty = transitionVals.top;
    icon.style.transitionDuration = this._transitionDuration + 'ms';
    icon.style.transitionDelay = 0 + 'ms';
};

IconController.prototype._removeTransition = function(icon) {
    icon.style.transitionTimingFunction = '';
    icon.style.transitionProperty = '';
    icon.style.transitionDuration = '';
    icon.style.transitionDelay = '';
};

IconController.prototype.removeTransition = function(slide) {
    this._removeTransition(slide._iconElem);
};

IconController.prototype.moveIcon = function(slide) {
    var slideStateInfo = slide.getStateInfo(slide.getCurrentState());

    this._addTransitionTop.bind(this)(slide._iconElem);

    if (this._isTopSlide.bind(this)(slide)) {
        if (slideStateInfo.finalState === slideStateVals.open) {
            this._slides[slidePositionVals.top].iconElem.style.top = imgTopVals.topOpen + 'px';

        } else if (slideStateInfo.finalState === slideStateVals.closed) {
            this._slides[slidePositionVals.top].iconElem.style.top = imgTopVals.topClosed + 'px';

        } else if (slideStateInfo.finalState === slideStateVals.collapsed) {
            this._slides[slidePositionVals.top].iconElem.style.top = imgTopVals.topCollapsed + 'px';

        }

    } else if (this._isBottomSlide.bind(this)(slide)) {

        if (slideStateInfo.finalState === slideStateVals.open) {
            this._slides[slidePositionVals.bottom].iconElem.style.top = imgTopVals.bottomOpen + 'px';

        } else if (slideStateInfo.finalState === slideStateVals.closed) {
            this._slides[slidePositionVals.bottom].iconElem.style.top = imgTopVals.bottomClosed + 'px';

        } else if (slideStateInfo.finalState === slideStateVals.collapsed) {
            this._slides[slidePositionVals.bottom].iconElem.style.top = imgTopVals.bottomCollapsed + 'px';

        }

    } else if (this._isMiddleSlide.bind(this)(slide)) {

        if (slideStateInfo.finalState === slideStateVals.open) {
            this._slides[slidePositionVals.middle].iconElem.style.top = imgTopVals.middleOpen + 'px';

        } else if (slideStateInfo.finalState === slideStateVals.closed) {
            this._slides[slidePositionVals.middle].iconElem.style.top = imgTopVals.middleClosed + 'px';

        } else if (slideStateInfo.finalState === slideStateVals.collapsed) {

            var topSlideFinalState = slide.getStateInfo(this._slides[slidePositionVals.top].slide.getCurrentState()).finalState;
            // var bottomSlideFinalState = slide.getStateInfo(this._slides[slidePositionVals.bottom].slide.getCurrentState()).finalState;
            // console.log(this._slides[slidePositionVals.top].slide.getCurrentState());
            // console.log(this._slides[slidePositionVals.bottom].slide.getCurrentState());

            if (topSlideFinalState === slideStateVals.open) {
                this._slides[slidePositionVals.middle].iconElem.style.top = imgTopVals.middleCollapsedOnTabTop + 'px';
            } else /*if (bottomSlideFinalState === slideStateVals.open)*/ {
                this._slides[slidePositionVals.middle].iconElem.style.top = imgTopVals.middleCollapsedOnTabBottom + 'px';
            }

        }

    }
};

IconController.prototype._isTopSlide = function(slide) {
    return slide === this._slides[slidePositionVals.top].slide
};

IconController.prototype._isMiddleSlide = function(slide) {
    return slide === this._slides[slidePositionVals.middle].slide
};

IconController.prototype._isBottomSlide = function(slide) {
    return slide === this._slides[slidePositionVals.bottom].slide
};

module.exports = VerticalSlider;