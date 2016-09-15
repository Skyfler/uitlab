"use strict";

var CONSTANTS = require('./verticalSlider-constants');
var Helper = require('./helper');

function SideMenu(options) {
    Helper.call(this, options);

    this._elem = options.elem;

    this._onClick = this._onClick.bind(this);

    this._addListener(this._elem, 'click', this._onClick);
}

SideMenu.prototype = Object.create(Helper.prototype);
SideMenu.prototype.constructor = SideMenu;

SideMenu.prototype._onClick = function(e) {
    var target = e.target;
    if (!target) return;
    var control = target.closest('[data-slide-index]');
    if (!control) return;
    var slideIndex = control.dataset.slideIndex;
    if (!slideIndex) return;

    this._sendCustomEvent(this._elem, 'signaltoopenslide', {
        bubbles: true,
        detail: {
            slideNum: slideIndex
        }
    });
};

module.exports = SideMenu;