"use strict";

function AnimateCircle(options) {
    this._elem = options.elem;
    this._delayBeforeStop = options.delayBeforeStop;

    this._elem.addEventListener('mouseover', this._onMouseOver.bind(this));
    this._elem.addEventListener('mouseout', this._onMouseOut.bind(this));
}

AnimateCircle.prototype._playAnimation = function() {
    if (this._timer) {
        clearTimeout(this._timer);
    }

    if (!this._elem.classList.contains('js-play')) {
        this._elem.classList.add('js-play');
    }
};

AnimateCircle.prototype._stopAnimation = function() {
    if (this._timer) {
        clearTimeout(this._timer);
    }

    this._timer = setTimeout(function() {
        if (this._elem.classList.contains('js-play')) {
            this._elem.classList.remove('js-play');
        }
    }.bind(this), this._delayBeforeStop);
};

AnimateCircle.prototype._onMouseOver = function(e) {
    var target = e.target;
    var previousTarget = e.relatedTarget;

    if (!this._isChild(previousTarget)) {
        this._playAnimation();
    }
};

AnimateCircle.prototype._onMouseOut = function(e) {
    var target = e.target;
    var nextTarget = e.relatedTarget;

    if (!this._isChild(nextTarget)) {
        this._stopAnimation();
    }
};

AnimateCircle.prototype._isChild = function(element) {
    return this._elem.contains(element);
};

module.exports = AnimateCircle;