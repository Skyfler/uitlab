"use strict";

var CONSTANTS = require('./verticalSlider-constants');
var Helper = require('./helper');

function OverflowController(options) {
    Helper.call(this, options);

    this._elem = options.elem;
    this._initialisation = options.initialisation;
    this._closedSlideHeight = options.closedSlideHeight;

    this._init();
}

OverflowController.prototype = Object.create(Helper.prototype);
OverflowController.prototype.constructor = OverflowController;

OverflowController.prototype._init = function() {
    /*if (this._initialisation === CONSTANTS.sliderInitalisation.mobile) {
        this._elem.style.height  = this._closedSlideHeight * 4 + 'px';
    } else {
        this._elem.style.height = this._closedSlideHeight * 3 + 'px';
    }*/
    this._elem.style.top = 0;
};

OverflowController.prototype.moveOverflowDown = function() {
    this._elem.style.top = (this._elem.style.top ? parseFloat(this._elem.style.top) : 0) + this._closedSlideHeight + 'px';
};

OverflowController.prototype.moveOverflowUp = function() {
    this._elem.style.top = (this._elem.style.top ? parseFloat(this._elem.style.top) : 0) - this._closedSlideHeight + 'px';
};

module.exports = OverflowController;