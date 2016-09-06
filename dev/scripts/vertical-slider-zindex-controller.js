"use strict";

var CONSTANTS = require('./vertical-slider-constants');
var Helper = require('./helper');

function ZIndexController(options) {
    Helper.call(this, options);

    this._slidesArr = options.slidesArr;
}

ZIndexController.prototype = Object.create(Helper.prototype);
ZIndexController.prototype.constructor = ZIndexController;

ZIndexController.prototype.resetIndexes = function() {
    this._refreshSlidesInfo();

    if (this._checkAllPreviouslyClosed() || !this._checkTransitionBeforeBP()) {

        if (this._checkTopOpens()) {
            this._setLowMediumHighIndex();

        } else if(this._checkMiddleOpens()) {
            this._setHighLowHighIndex();

        } else if(this._checkBottomOpens()) {
            this._setHighMediumLowIndex();

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
    this._slides[CONSTANTS.slidePositionVals.top].slide.zIndex(CONSTANTS.slideZIndexVals.high);
    this._slides[CONSTANTS.slidePositionVals.middle].slide.zIndex(CONSTANTS.slideZIndexVals.medium);
    this._slides[CONSTANTS.slidePositionVals.bottom].slide.zIndex(CONSTANTS.slideZIndexVals.low);
};

ZIndexController.prototype._setHighLowHighIndex = function() {
    /*
     * */
    this._slides[CONSTANTS.slidePositionVals.top].slide.zIndex(CONSTANTS.slideZIndexVals.high);
    this._slides[CONSTANTS.slidePositionVals.middle].slide.zIndex(CONSTANTS.slideZIndexVals.low);
    this._slides[CONSTANTS.slidePositionVals.bottom].slide.zIndex(CONSTANTS.slideZIndexVals.high);
};

ZIndexController.prototype._setLowMediumHighIndex = function() {
    /*
     * */
    this._slides[CONSTANTS.slidePositionVals.top].slide.zIndex(CONSTANTS.slideZIndexVals.low);
    this._slides[CONSTANTS.slidePositionVals.middle].slide.zIndex(CONSTANTS.slideZIndexVals.medium);
    this._slides[CONSTANTS.slidePositionVals.bottom].slide.zIndex(CONSTANTS.slideZIndexVals.high);
};


ZIndexController.prototype._checkAllPreviouslyClosed = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].previousState === CONSTANTS.slideStateVals.closed &&
        this._slides[CONSTANTS.slidePositionVals.middle].previousState === CONSTANTS.slideStateVals.closed &&
        this._slides[CONSTANTS.slidePositionVals.bottom].previousState === CONSTANTS.slideStateVals.closed;
};

ZIndexController.prototype._checkAllWillBeClosed = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].stateInfo.finalState === CONSTANTS.slideStateVals.closed &&
        this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.finalState === CONSTANTS.slideStateVals.closed &&
        this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.finalState === CONSTANTS.slideStateVals.closed;
};

ZIndexController.prototype._checkTopOpens = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].stateInfo.finalState === CONSTANTS.slideStateVals.open
};

ZIndexController.prototype._checkMiddleOpens = function() {
    return this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.finalState === CONSTANTS.slideStateVals.open
};

ZIndexController.prototype._checkBottomOpens = function() {
    return this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.finalState === CONSTANTS.slideStateVals.open
};

ZIndexController.prototype._checkTopCollapses = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].stateInfo.finalState === CONSTANTS.slideStateVals.collapsed
};

ZIndexController.prototype._checkMiddleCollapses = function() {
    return this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.finalState === CONSTANTS.slideStateVals.collapsed
};

ZIndexController.prototype._checkBottomCollapses = function() {
    return this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.finalState === CONSTANTS.slideStateVals.collapsed
};

ZIndexController.prototype._checkTransitionBeforeBP = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].stateInfo.type === CONSTANTS.slideStateVals.transitionalBeforeBP ||
        this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.type === CONSTANTS.slideStateVals.transitionalBeforeBP ||
        this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.type === CONSTANTS.slideStateVals.transitionalBeforeBP;
};

module.exports = ZIndexController;