"use strict";

var CONSTANTS = require('./verticalSlider-constants');
var Helper = require('./helper');

function IconController(options) {
    Helper.call(this, options);

    this._slidesArr = options.slidesArr;
    this._transitionDuration = options.transitionDuration;

    this._getIcons();
    this._refreshSlidesInfo();
    this._setAllClosed();
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

IconController.prototype = Object.create(Helper.prototype);
IconController.prototype.constructor = IconController;

IconController.prototype._setAllClosed =  function() {
    this._slides[CONSTANTS.slidePositionVals.top].iconElem.style.top = CONSTANTS.imgTopVals.topClosed + 'px';
    this._slides[CONSTANTS.slidePositionVals.middle].iconElem.style.top = CONSTANTS.imgTopVals.middleClosed + 'px';
    this._slides[CONSTANTS.slidePositionVals.bottom].iconElem.style.top = CONSTANTS.imgTopVals.bottomClosed + 'px';
};

IconController.prototype._addTransitionTop = function(icon) {
    icon.style.transitionTimingFunction = CONSTANTS.transitionVals.linear;
    icon.style.transitionProperty = CONSTANTS.transitionVals.top;
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

    this._addTransitionTop(slide._iconElem);

    if (this._isTopSlide(slide)) {
        if (slideStateInfo.finalState === CONSTANTS.slideStateVals.open) {
            this._slides[CONSTANTS.slidePositionVals.top].iconElem.style.top = CONSTANTS.imgTopVals.topOpen + 'px';

        } else if (slideStateInfo.finalState === CONSTANTS.slideStateVals.closed) {
            this._slides[CONSTANTS.slidePositionVals.top].iconElem.style.top = CONSTANTS.imgTopVals.topClosed + 'px';

        } else if (slideStateInfo.finalState === CONSTANTS.slideStateVals.collapsed) {
            this._slides[CONSTANTS.slidePositionVals.top].iconElem.style.top = CONSTANTS.imgTopVals.topCollapsed + 'px';

        }

    } else if (this._isBottomSlide(slide)) {

        if (slideStateInfo.finalState === CONSTANTS.slideStateVals.open) {
            this._slides[CONSTANTS.slidePositionVals.bottom].iconElem.style.top = CONSTANTS.imgTopVals.bottomOpen + 'px';

        } else if (slideStateInfo.finalState === CONSTANTS.slideStateVals.closed) {
            this._slides[CONSTANTS.slidePositionVals.bottom].iconElem.style.top = CONSTANTS.imgTopVals.bottomClosed + 'px';

        } else if (slideStateInfo.finalState === CONSTANTS.slideStateVals.collapsed) {
            this._slides[CONSTANTS.slidePositionVals.bottom].iconElem.style.top = CONSTANTS.imgTopVals.bottomCollapsed + 'px';

        }

    } else if (this._isMiddleSlide(slide)) {

        if (slideStateInfo.finalState === CONSTANTS.slideStateVals.open) {
            this._slides[CONSTANTS.slidePositionVals.middle].iconElem.style.top = CONSTANTS.imgTopVals.middleOpen + 'px';

        } else if (slideStateInfo.finalState === CONSTANTS.slideStateVals.closed) {
            this._slides[CONSTANTS.slidePositionVals.middle].iconElem.style.top = CONSTANTS.imgTopVals.middleClosed + 'px';

        } else if (slideStateInfo.finalState === CONSTANTS.slideStateVals.collapsed) {

            var topSlideFinalState = slide.getStateInfo(this._slides[CONSTANTS.slidePositionVals.top].slide.getCurrentState()).finalState;
            // var bottomSlideFinalState = slide.getStateInfo(this._slides[CONSTANTS.slidePositionVals.bottom].slide.getCurrentState()).finalState;
            // console.log(this._slides[CONSTANTS.slidePositionVals.top].slide.getCurrentState());
            // console.log(this._slides[CONSTANTS.slidePositionVals.bottom].slide.getCurrentState());

            if (topSlideFinalState === CONSTANTS.slideStateVals.open) {
                this._slides[CONSTANTS.slidePositionVals.middle].iconElem.style.top = CONSTANTS.imgTopVals.middleCollapsedOnTabTop + 'px';
            } else /*if (bottomSlideFinalState === CONSTANTS.slideStateVals.open)*/ {
                this._slides[CONSTANTS.slidePositionVals.middle].iconElem.style.top = CONSTANTS.imgTopVals.middleCollapsedOnTabBottom + 'px';
            }

        }

    }
};

IconController.prototype._isTopSlide = function(slide) {
    return slide === this._slides[CONSTANTS.slidePositionVals.top].slide
};

IconController.prototype._isMiddleSlide = function(slide) {
    return slide === this._slides[CONSTANTS.slidePositionVals.middle].slide
};

IconController.prototype._isBottomSlide = function(slide) {
    return slide === this._slides[CONSTANTS.slidePositionVals.bottom].slide
};

module.exports = IconController;