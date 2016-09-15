"use strict";

var CONSTANTS = require('./verticalSlider-constants');
var Helper = require('./helper');

function BackgroundController(options) {
    Helper.call(this, options);

    this._slidesArr = options.slidesArr;

    this.refreshBackgroundClasses();
}

BackgroundController.prototype = Object.create(Helper.prototype);
BackgroundController.prototype.constructor = BackgroundController;

BackgroundController.prototype._refreshSlidesInfo = function() {
    this._slides = {};

    for (var i = 0; i < this._slidesArr.length; i++) {
        var position = this._slidesArr[i].getPosition();
        this._slides[position] = {};
        this._slides[position].slide = this._slidesArr[i];
        this._slides[position].index = i;
        this._slides[position].stateInfo = this._slidesArr[i].getStateInfo(this._slidesArr[i].getCurrentState());
    }
};

BackgroundController.prototype.refreshBackgroundClasses = function() {
    this._refreshSlidesInfo();

    var topSlide = this._slides[CONSTANTS.slidePositionVals.top],
        middleSlide = this._slides[CONSTANTS.slidePositionVals.middle],
        bottomSlide = this._slides[CONSTANTS.slidePositionVals.bottom],
        hiddenSlide = this._slides[CONSTANTS.slidePositionVals.hidden] || false;

    if (
        this._isFinalStateClosed(topSlide.stateInfo.finalState) &&
        this._isFinalStateClosed(middleSlide.stateInfo.finalState) &&
        this._isFinalStateClosed(bottomSlide.stateInfo.finalState) &&
        // this._isFinalStateClosed(hiddenSlide.stateInfo.finalState)
        (!hiddenSlide || this._isFinalStateClosed(hiddenSlide.stateInfo.finalState))
    ) {
        this._setBackgroundClass(topSlide.slide._elem, 'bgIndex2', true);
        this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex2', true);
        this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex2', true);
        // this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex2', true);
        hiddenSlide ? this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex2', true) : false;

    } else if (
        this._isFinalStateOpen(topSlide.stateInfo.finalState) &&
        this._isFinalStateCollapse(middleSlide.stateInfo.finalState) &&
        this._isFinalStateCollapse(bottomSlide.stateInfo.finalState) &&
        // this._isFinalStateCollapse(hiddenSlide.stateInfo.finalState)
        (hiddenSlide && this._isFinalStateCollapse(hiddenSlide.stateInfo.finalState))
    ) {
        if (this._slides[CONSTANTS.slidePositionVals.hidden].index === 0) {
            this._setBackgroundClass(topSlide.slide._elem, 'bgIndex1');
            this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex3');
            this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex4');
            this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex3');
        } else if (this._slides[CONSTANTS.slidePositionVals.hidden].index === 3) {
            this._setBackgroundClass(topSlide.slide._elem, 'bgIndex1');
            this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex2');
            this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex3');
            this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex4');
        }

    } else if (
        this._isFinalStateCollapse(topSlide.stateInfo.finalState) &&
        this._isFinalStateOpen(middleSlide.stateInfo.finalState) &&
        this._isFinalStateCollapse(bottomSlide.stateInfo.finalState) &&
        // this._isFinalStateCollapse(hiddenSlide.stateInfo.finalState)
        (hiddenSlide && this._isFinalStateCollapse(hiddenSlide.stateInfo.finalState))
    ) {
        this._setBackgroundClass(topSlide.slide._elem, 'bgIndex3');
        this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex1');
        this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex3');
        this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex4');

    } else if (
        this._isFinalStateCollapse(topSlide.stateInfo.finalState) &&
        this._isFinalStateCollapse(middleSlide.stateInfo.finalState) &&
        this._isFinalStateOpen(bottomSlide.stateInfo.finalState) &&
        // this._isFinalStateCollapse(hiddenSlide.stateInfo.finalState)
        (hiddenSlide && this._isFinalStateCollapse(hiddenSlide.stateInfo.finalState))
    ) {
        if (this._slides[CONSTANTS.slidePositionVals.hidden].index === 0) {
            this._setBackgroundClass(topSlide.slide._elem, 'bgIndex3');
            this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex2');
            this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex1');
            this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex4');
        } else if (this._slides[CONSTANTS.slidePositionVals.hidden].index === 3) {
            this._setBackgroundClass(topSlide.slide._elem, 'bgIndex4');
            this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex3');
            this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex1');
            this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex3');
        }

    } else if (
        this._isFinalStateOpen(topSlide.stateInfo.finalState) &&
        this._isFinalStateCollapse(middleSlide.stateInfo.finalState) &&
        this._isFinalStateCollapse(bottomSlide.stateInfo.finalState) &&
        // this._isFinalStateClosed(hiddenSlide.stateInfo.finalState)
        (!hiddenSlide || this._isFinalStateClosed(hiddenSlide.stateInfo.finalState))
    ) {
        this._setBackgroundClass(topSlide.slide._elem, 'bgIndex1');
        this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex3');
        this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex4');
        // this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex3');
        hiddenSlide ? this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex3') : false;

    } else if (
        this._isFinalStateCollapse(topSlide.stateInfo.finalState) &&
        this._isFinalStateOpen(middleSlide.stateInfo.finalState) &&
        this._isFinalStateCollapse(bottomSlide.stateInfo.finalState) &&
        // this._isFinalStateClosed(hiddenSlide.stateInfo.finalState)
        (!hiddenSlide || this._isFinalStateClosed(hiddenSlide.stateInfo.finalState))
    ) {
        this._setBackgroundClass(topSlide.slide._elem, 'bgIndex3');
        this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex1');
        this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex3');
        // this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex3');
        hiddenSlide ? this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex3') : false;

    } else if (
        this._isFinalStateCollapse(topSlide.stateInfo.finalState) &&
        this._isFinalStateCollapse(middleSlide.stateInfo.finalState) &&
        this._isFinalStateOpen(bottomSlide.stateInfo.finalState) &&
        // this._isFinalStateClosed(hiddenSlide.stateInfo.finalState)
        (!hiddenSlide || this._isFinalStateClosed(hiddenSlide.stateInfo.finalState))
    ) {
        this._setBackgroundClass(topSlide.slide._elem, 'bgIndex4');
        this._setBackgroundClass(middleSlide.slide._elem, 'bgIndex3');
        this._setBackgroundClass(bottomSlide.slide._elem, 'bgIndex1');
        // this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex3');
        hiddenSlide ? this._setBackgroundClass(hiddenSlide.slide._elem, 'bgIndex3') : false;

    }
};

BackgroundController.prototype._setBackgroundClass = function(slideElem, bgClass, chackForCenter) {
    this._removeColorClasses(slideElem);

    if (chackForCenter && this._isCenter(slideElem)) {
        slideElem.classList.add('bgCenter');
    }
    slideElem.classList.add(bgClass);
};

BackgroundController.prototype._isFinalStateCollapse = function(finalState) {
    return finalState === CONSTANTS.slideStateVals.collapsed;
};

BackgroundController.prototype._isFinalStateOpen = function(finalState) {
    return finalState === CONSTANTS.slideStateVals.open;
};

BackgroundController.prototype._isFinalStateClosed = function(finalState) {
    return finalState === CONSTANTS.slideStateVals.closed;
};

BackgroundController.prototype._isCenter = function(slideElem) {
    return slideElem.classList.contains('center');
};

BackgroundController.prototype._removeColorClasses = function(slideElem) {
    if (slideElem.classList.contains('bgIndex1')) {
        slideElem.classList.remove('bgIndex1')
    }
    if (slideElem.classList.contains('bgIndex2')) {
        slideElem.classList.remove('bgIndex2')
    }
    if (slideElem.classList.contains('bgIndex3')) {
        slideElem.classList.remove('bgIndex3')
    }
    if (slideElem.classList.contains('bgIndex4')) {
        slideElem.classList.remove('bgIndex4')
    }
    if (slideElem.classList.contains('bgCenter')) {
        slideElem.classList.remove('bgCenter')
    }
};

module.exports = BackgroundController;