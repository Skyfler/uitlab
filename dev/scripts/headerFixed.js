"use strict";

var Helper = require('./helper');

function HeaderFixed(options) {
    Helper.call(this, options);

    this._elem = options.elem;
    this._fixedClass = options.fixedClass;

    this._onScroll = this._onScroll.bind(this);
    this._onDOMContentLoaded = this._onDOMContentLoaded.bind(this);
    this._onResize = this._onResize.bind(this);

    this._addListener(document, 'DOMContentLoaded', this._onDOMContentLoaded);
}

HeaderFixed.prototype = Object.create(Helper.prototype);
HeaderFixed.prototype.constructor = HeaderFixed;

HeaderFixed.prototype._onDOMContentLoaded = function() {
    setTimeout(function() {
        if (!this._elem) return;
        this._init();
    }.bind(this), 1000);
};

HeaderFixed.prototype._init = function() {
    this._fixedScrollHeight = this._elem.offsetHeight;
    this._fixed = false;

    this._onScroll();
    this._addListener(document, 'scroll', this._onScroll);
    this._addListener(window, 'resize', this._onResize);
};

HeaderFixed.prototype._onScroll = function(e) {
    var scroll = window.pageYOffset || document.documentElement.scrollTop;
    // console.log(scroll);

    if (scroll > this._fixedScrollHeight && !this._fixed) {
        this._addFixedClass();

    } else if (scroll < this._fixedScrollHeight && this._fixed) {
        this._removeFixedClass();

    }
};

HeaderFixed.prototype._addFixedClass = function() {
    this._fixed = true;
    this._elem.classList.add(this._fixedClass);
    document.body.style.paddingTop = this._fixedScrollHeight + 'px';
};

HeaderFixed.prototype._removeFixedClass = function() {
    this._fixed = false;
    this._elem.classList.remove(this._fixedClass);
    document.body.style.paddingTop = '';
};

HeaderFixed.prototype._onResize = function() {
    var height = this._elem.offsetHeight;

    if (this._fixedScrollHeight !== height) {
        this._fixedScrollHeight = height;

        this._fixed ? document.body.style.paddingTop = this._fixedScrollHeight + 'px' : false;
        this._onScroll();
    }
};

module.exports = HeaderFixed;