"use strict";

var CONSTANTS = require('./vertical-slider-constants');
var Helper = require('./helper');

function Slide(options) {
    Helper.call(this, options);

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

Slide.prototype = Object.create(Helper.prototype);
Slide.prototype.constructor = Slide;

Slide.prototype._addTransition = function() {
    // this._elem.addEventListener('transitionend', this._onTransitionEnd);
    this._addListener(this._elem, 'transitionend', this._onTransitionEnd);

    this._elem.style.transitionTimingFunction = CONSTANTS.transitionVals.linear;
    this._elem.style.transitionProperty = [CONSTANTS.transitionVals.height, CONSTANTS.transitionVals.boxShadow, CONSTANTS.transitionVals.backgroundColor].join(', ');
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
    // this._elem.removeEventListener('transitionend', this._onTransitionEnd);
    this._removeListener(this._elem, 'transitionend', this._onTransitionEnd);

    this._elem.style.transitionTimingFunction = '';
    this._elem.style.transitionProperty = '';
    this._elem.style.transitionDuration = '';
    this._elem.style.transitionDelay = '';
};

Slide.prototype._onTransitionEnd = function(e) {
    var target = e.target;
    var prop = e.propertyName;

    if (!prop || target !== this._elem || prop !== CONSTANTS.transitionVals.height) return;

    var stateInfo = this.getStateInfo(this._state);

    this._state = this._nextState;
    this._changeStateClass();

    var widgetEvent;

    if (stateInfo.type === CONSTANTS.slideStateVals.transitionalBeforeBP) {
        widgetEvent = new CustomEvent("slidechangingstate", {
            bubbles: true,
            detail: {
                state: this._state
            }
        });

        this._nextState = stateInfo.finalState;

        this._elem.style.height = this._finalHeight + 'px';
    } else if (stateInfo.type === CONSTANTS.slideStateVals.transitionalAfterBP) {

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

        this._removeTransition();

    }

    this._elem.dispatchEvent(widgetEvent);
};

Slide.prototype.changeState = function(newState, finalSlideHeight) {
    this._finalHeight = finalSlideHeight;
    var stateInfo = this.getStateInfo(newState);
    var newSlideHeight = this._currentHeight + (this._finalHeight - this._currentHeight) / 2;

    this._addTransition();

    this._previousState = this._state;

    if (this._previousState === CONSTANTS.slideStateVals.open) {
        this._removeBackgroundFromSlide();
    } else if (stateInfo.finalState === CONSTANTS.slideStateVals.open) {
        this._setBackgroundOnOpeningSlide();
    }

    this._state = stateInfo.transitionalStateBeforeBP;
    this._changeStateClass();
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

    if (this._previousState === CONSTANTS.slideStateVals.open) {
        this._removeBackgroundFromSlide();
    } else if (stateInfo.finalState === CONSTANTS.slideStateVals.open) {
        this._setBackgroundOnOpeningSlide();
    }

    this._currentHeight = finalSlideHeight;
    this._state = newState;
    this._changeStateClass.bind(this)();

    this._elem.style.height = finalSlideHeight + 'px';
};

Slide.prototype._getOpenSlideBackground = function() {

    try {
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
    } catch (err) {
        console.log(err);
    }

    // console.log(this._openSlideBackground);
};

Slide.prototype._changeStateClass = function() {
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.closed)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.closed);
    }
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.closingBeforeBP)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.closingBeforeBP);
    }
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.closingAfterBP)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.closingAfterBP);
    }
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.open)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.open);
    }
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.openingBeforeBP)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.openingBeforeBP);
    }
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.openingAfterBP)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.openingAfterBP);
    }
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.collapsed)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.collapsed);
    }
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.collapsingBeforeBP)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.collapsingBeforeBP);
    }
    if (this._elem.classList.contains(CONSTANTS.slideStateVals.collapsingAfterBP)) {
        this._elem.classList.remove(CONSTANTS.slideStateVals.collapsingAfterBP);
    }

    this._elem.classList.add(this._state);
};

Slide.prototype.getStateInfo = function(state) {
    var dataObj = {};

    switch (state) {

        case CONSTANTS.slideStateVals.closed:
            dataObj.type = CONSTANTS.slideStateVals.completed;
        case CONSTANTS.slideStateVals.closingBeforeBP:
            dataObj.type = dataObj.type || CONSTANTS.slideStateVals.transitionalBeforeBP;
        case CONSTANTS.slideStateVals.closingAfterBP:
            dataObj.type = dataObj.type || CONSTANTS.slideStateVals.transitionalAfterBP;
            dataObj.finalState = CONSTANTS.slideStateVals.closed;
            dataObj.transitionalStateBeforeBP = CONSTANTS.slideStateVals.closingBeforeBP;
            dataObj.transitionalStateAfterBP = CONSTANTS.slideStateVals.closingAfterBP;
            break;

        case CONSTANTS.slideStateVals.open:
            dataObj.type = CONSTANTS.slideStateVals.completed;
        case CONSTANTS.slideStateVals.openingBeforeBP:
            dataObj.type = dataObj.type || CONSTANTS.slideStateVals.transitionalBeforeBP;
        case CONSTANTS.slideStateVals.openingAfterBP:
            dataObj.type = dataObj.type || CONSTANTS.slideStateVals.transitionalAfterBP;
            dataObj.finalState = CONSTANTS.slideStateVals.open;
            dataObj.transitionalStateBeforeBP = CONSTANTS.slideStateVals.openingBeforeBP;
            dataObj.transitionalStateAfterBP = CONSTANTS.slideStateVals.openingAfterBP;
            break;

        case CONSTANTS.slideStateVals.collapsed:
            dataObj.type = CONSTANTS.slideStateVals.completed;
        case CONSTANTS.slideStateVals.collapsingBeforeBP:
            dataObj.type = dataObj.type || CONSTANTS.slideStateVals.transitionalBeforeBP;
        case CONSTANTS.slideStateVals.collapsingAfterBP:
            dataObj.type = dataObj.type || CONSTANTS.slideStateVals.transitionalAfterBP;
            dataObj.finalState = CONSTANTS.slideStateVals.collapsed;
            dataObj.transitionalStateBeforeBP = CONSTANTS.slideStateVals.collapsingBeforeBP;
            dataObj.transitionalStateAfterBP = CONSTANTS.slideStateVals.collapsingAfterBP;
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

module.exports = Slide;