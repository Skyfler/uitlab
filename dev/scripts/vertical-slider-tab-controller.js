"use strict";

var CONSTANTS = require('./vertical-slider-constants');
var Helper = require('./helper');

function TabController(options) {
    Helper.call(this, options);

    this._slidesArr = options.slidesArr;
    this._transitionDuration = options.transitionDuration;

    // this.resetTabsPosition = this.resetTabsPosition.bind(this);
    // this.addTransitionToAll = this.addTransitionToAll.bind(this);
    // this.removeTransitionFromAll = this.removeTransitionFromAll.bind(this);

    this._refreshSlidesInfo.bind(this)();
}

TabController.prototype = Object.create(Helper.prototype);
TabController.prototype.constructor = TabController;

TabController.prototype.resetTabsPosition = function() {
    this._refreshSlidesInfo();

    if (this._checkAllPreviouslyClosed()) {

        if (this._checkTopOpens()) {
            this._setTabPositionsBottomTopTop();

        } else if(this._checkMiddleOpens()) {
            this._setTabPositionsBottomTopTop();

        } else if(this._checkBottomOpens()) {
            this._setTabPositionsBottomBottomTop();

        }

    } else {

        if (this._checkMiddleOpens() && this._checkTopCollapses()) {
            this._setTabPositionsBottomTopTop();
            // console.log('middle opens & top collapses');

        } else if (this._checkMiddleOpens() && this._checkBottomCollapses()) {
            this._setTabPositionsBottomBottomTop();
            // console.log('middle opens & bottom collapses');

        } else if (this._checkBottomOpens() && this._checkMiddleCollapses()) {
            this._setTabPositionsBottomBottomTop();
            // console.log('bottom opens & middle collapses');

        } else if (this._checkTopOpens() && this._checkMiddleCollapses()) {
            this._setTabPositionsBottomTopTop();
            // console.log('top opens & middle collapses');

        } else if (this._checkTopOpens() && this._checkBottomCollapses()) {
            this._setTabPositionsBottomTopTop();

        } else  if (this._checkBottomOpens() && this._checkTopCollapses()) {
            this._setTabPositionsBottomBottomTop();

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
    this._setTabPositionBottom(this._slides[CONSTANTS.slidePositionVals.top].slide);
    this._setTabPositionBottom(this._slides[CONSTANTS.slidePositionVals.middle].slide);
    this._setTabPositionTop(this._slides[CONSTANTS.slidePositionVals.bottom].slide);
};

TabController.prototype._setTabPositionsBottomTopTop = function() {
    this._setTabPositionBottom(this._slides[CONSTANTS.slidePositionVals.top].slide);
    this._setTabPositionTop(this._slides[CONSTANTS.slidePositionVals.middle].slide);
    this._setTabPositionTop(this._slides[CONSTANTS.slidePositionVals.bottom].slide);
};

TabController.prototype._setTabPositionTop = function(slide) {
    slide._tabPosition = CONSTANTS.tabPositionVals.top;
    this._removeTabPositionClasses(slide);
    slide._elem.classList.add(CONSTANTS.tabPositionVals.top);
};

TabController.prototype._setTabPositionBottom = function(slide) {
    slide._tabPosition = CONSTANTS.tabPositionVals.bottom;
    this._removeTabPositionClasses(slide);
    slide._elem.classList.add(CONSTANTS.tabPositionVals.bottom);
};

TabController.prototype._removeTabPositionClasses = function(slide) {
    if (slide._elem.classList.contains(CONSTANTS.tabPositionVals.top)) {
        slide._elem.classList.remove(CONSTANTS.tabPositionVals.top);
    }
    if (slide._elem.classList.contains(CONSTANTS.tabPositionVals.bottom)) {
        slide._elem.classList.remove(CONSTANTS.tabPositionVals.bottom);
    }
};

TabController.prototype._checkAllPreviouslyClosed = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].previousState === CONSTANTS.slideStateVals.closed &&
        this._slides[CONSTANTS.slidePositionVals.middle].previousState === CONSTANTS.slideStateVals.closed &&
        this._slides[CONSTANTS.slidePositionVals.bottom].previousState === CONSTANTS.slideStateVals.closed;
};

TabController.prototype._checkAllWillBeClosed = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].stateInfo.finalState === CONSTANTS.slideStateVals.closed &&
        this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.finalState === CONSTANTS.slideStateVals.closed &&
        this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.finalState === CONSTANTS.slideStateVals.closed;
};

TabController.prototype._checkTopOpens = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].stateInfo.finalState === CONSTANTS.slideStateVals.open &&
        this._slides[CONSTANTS.slidePositionVals.top].stateInfo.type !== CONSTANTS.slideStateVals.completed;
};

TabController.prototype._checkMiddleOpens = function() {
    return this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.finalState === CONSTANTS.slideStateVals.open &&
        this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.type !== CONSTANTS.slideStateVals.completed;
};

TabController.prototype._checkBottomOpens = function() {
    return this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.finalState === CONSTANTS.slideStateVals.open &&
        this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.type !== CONSTANTS.slideStateVals.completed;
};

TabController.prototype._checkTopCollapses = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].stateInfo.finalState === CONSTANTS.slideStateVals.collapsed &&
        this._slides[CONSTANTS.slidePositionVals.top].stateInfo.type !== CONSTANTS.slideStateVals.completed;
};

TabController.prototype._checkMiddleCollapses = function() {
    return this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.finalState === CONSTANTS.slideStateVals.collapsed &&
        this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.type !== CONSTANTS.slideStateVals.completed;
};

TabController.prototype._checkBottomCollapses = function() {
    return this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.finalState === CONSTANTS.slideStateVals.collapsed &&
        this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.type !== CONSTANTS.slideStateVals.completed;
};

TabController.prototype._checkTransitionBeforeBP = function() {
    return this._slides[CONSTANTS.slidePositionVals.top].stateInfo.type === CONSTANTS.slideStateVals.transitionalBeforeBP ||
        this._slides[CONSTANTS.slidePositionVals.middle].stateInfo.type === CONSTANTS.slideStateVals.transitionalBeforeBP ||
        this._slides[CONSTANTS.slidePositionVals.bottom].stateInfo.type === CONSTANTS.slideStateVals.transitionalBeforeBP;
};

TabController.prototype._addTransitionBoxShadowBackground = function(tab) {
    tab.style.transitionTimingFunction = CONSTANTS.transitionVals.linear;
    tab.style.transitionProperty = [CONSTANTS.transitionVals.boxShadow, CONSTANTS.transitionVals.backgroundColor].join(', ');
    tab.style.transitionDuration = [this._transitionDuration + 'ms', (this._transitionDuration * 2) + 'ms'].join(', ');
    tab.style.transitionDelay = 0 + 'ms';
};

TabController.prototype._addTransitionBoxShadowTopBackground = function(tab) {
    tab.style.transitionTimingFunction = CONSTANTS.transitionVals.linear;
    tab.style.transitionProperty = [CONSTANTS.transitionVals.boxShadow, CONSTANTS.transitionVals.backgroundColor].join(', ');
    tab.style.transitionDuration = [this._transitionDuration + 'ms', this._transitionDuration + 'ms', (this._transitionDuration * 2) + 'ms'].join(', ');
    tab.style.transitionDelay = 0 + 'ms';
};

TabController.prototype.addTransitionToAll = function() {
    for (var i = 0; i < this._slides[CONSTANTS.slidePositionVals.top].tabs.length; i++) {
        this._addTransitionBoxShadowBackground(this._slides[CONSTANTS.slidePositionVals.top].tabs[i]);
    }
    for (i = 0; i < this._slides[CONSTANTS.slidePositionVals.middle].tabs.length; i++) {
        this._addTransitionBoxShadowBackground(this._slides[CONSTANTS.slidePositionVals.middle].tabs[i]);
    }
    for (i = 0; i < this._slides[CONSTANTS.slidePositionVals.bottom].tabs.length; i++) {
        this._addTransitionBoxShadowBackground(this._slides[CONSTANTS.slidePositionVals.bottom].tabs[i]);
    }
};

TabController.prototype.removeTransitionFromAll = function() {
    for (var i = 0; i < this._slides[CONSTANTS.slidePositionVals.top].tabs.length; i++) {
        this._removeTransition(this._slides[CONSTANTS.slidePositionVals.top].tabs[i]);
    }
    for (i = 0; i < this._slides[CONSTANTS.slidePositionVals.middle].tabs.length; i++) {
        this._removeTransition(this._slides[CONSTANTS.slidePositionVals.middle].tabs[i]);
    }
    for (i = 0; i < this._slides[CONSTANTS.slidePositionVals.bottom].tabs.length; i++) {
        this._removeTransition(this._slides[CONSTANTS.slidePositionVals.bottom].tabs[i]);
    }
};

TabController.prototype._removeTransition = function(tab) {
    tab.style.transitionTimingFunction = '';
    tab.style.transitionProperty = '';
    tab.style.transitionDuration = '';
    tab.style.transitionDelay = '';
};

module.exports = TabController;