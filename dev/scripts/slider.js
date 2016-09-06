"use strict";

var Helper = require('./helper');

function Slider(options) {
    Helper.call(this, options);

    this._elem = options.elem;
    this._overflowBlock = this._elem.querySelector('.overflow_block');
    this._moveDelay = options.delay || 0;

    this._initSlider();

    this._onClick = this._onClick.bind(this);
    this._onCornerTransitionEnd = this._onCornerTransitionEnd.bind(this);
    this._onMiddleTransitionEnd = this._onMiddleTransitionEnd.bind(this);

    this._addListener(this._elem, 'click', this._onClick);
}

Slider.prototype = Object.create(Helper.prototype);
Slider.prototype.constructor = Slider;

Slider.prototype._initSlider = function() {
    //console.log('_initSlider');
    var slidesArr = this._overflowBlock.querySelectorAll('[data-component="slide"]');
    if (0 === slidesArr.length) return;

    this._slidesCount = slidesArr.length;
    this._currSlide = 1;
    //console.log('Cur slide = ' + this._currSlide);

    var firstSlide = slidesArr[0];
    var lastSlide = slidesArr[slidesArr.length - 1];

    this._overflowBlock.insertBefore(lastSlide.cloneNode(true), this._overflowBlock.firstChild);
    this._overflowBlock.appendChild(firstSlide.cloneNode(true));

    slidesArr = this._overflowBlock.querySelectorAll('[data-component="slide"]');
    for (var i = 0; i < slidesArr.length; i++) {
        slidesArr[i].style.width = 100 / (this._slidesCount + 2) + '%';
        slidesArr[i].classList.remove('selected');
    }
    slidesArr[1].classList.add('selected');
    this._overflowBlock.style.width = 100 * (this._slidesCount + 2) + '%';
    this._overflowBlock.style.left = '-100%';

    if (0 !== this._moveDelay) this._moveOverTime.bind(this)();
};

Slider.prototype._onClick = function(e) {
    e.preventDefault();
    var target = e.target;
    this._controlSlider(target);
};

Slider.prototype._controlSlider = function(target) {
    var control = target.closest('[data-component="slider_control"]');
    if (control) {
        //console.log(this._isMoving);
        if (this._isMoving) return;

        if (this._moveTimer) {
            clearTimeout(this._moveTimer);
        }
        switch (control.dataset.action) {
            case 'forward':
                this._moveSlideForward();
                break;
            case 'back':
                this._moveSlideBack();
                break;
        }

        if (0 !== this._moveDelay) this._moveOverTime();
    }
};

Slider.prototype._moveSlideForward = function() {
    this._overflowBlock.style.transitionDuration = '';
    this._isMoving = true;
    //console.log('_moveSlideForward');

    var slidesArr = this._overflowBlock.querySelectorAll('[data-component="slide"]');
    slidesArr[this._currSlide].classList.remove('selected');
    
    this._currSlide++;
    slidesArr[this._currSlide].classList.add('selected');
    
    this._overflowBlock.style.left = -100 * this._currSlide + '%';

    if (this._currSlide > this._slidesCount) {
        this._currSlide = 1;
        slidesArr[this._currSlide].classList.add('selected');
        this._addListener(this._elem, 'transitionend', this._onCornerTransitionEnd);
    } else {
        this._addListener(this._elem, 'transitionend', this._onMiddleTransitionEnd);
    }
        
    //console.log('Cur slide = ' + this._currSlide);
};

Slider.prototype._moveSlideBack = function() {
    this._overflowBlock.style.transitionDuration = '';
    this._isMoving = true;
    //console.log('_moveSlideBack');

    var slidesArr = this._overflowBlock.querySelectorAll('[data-component="slide"]');
    slidesArr[this._currSlide].classList.remove('selected');

    this._currSlide--;
    slidesArr[this._currSlide].classList.add('selected');
    
    this._overflowBlock.style.left = -100 * this._currSlide + '%';

    if (0 === this._currSlide) {
        this._currSlide = this._slidesCount;
        slidesArr[this._currSlide].classList.add('selected');
        this._addListener(this._elem, 'transitionend', this._onCornerTransitionEnd);
    } else {
        this._addListener(this._elem, 'transitionend', this._onMiddleTransitionEnd);
    }
    
    //console.log('Cur slide = ' + this._currSlide);
};

Slider.prototype._onMiddleTransitionEnd = function(e) {
    if (e.target !== this._overflowBlock) return;

    this._removeListener(this._elem, 'transitionend', this._onMiddleTransitionEnd);
    this._isMoving = false;
};

Slider.prototype._onCornerTransitionEnd = function(e) {
    if (e.target !== this._overflowBlock) return;

    this._removeListener(this._elem, 'transitionend', this._onCornerTransitionEnd);
    
    this._overflowBlock.style.transitionDuration = '0s';
    this._overflowBlock.style.left = -100 * (this._currSlide) + '%';
    var slidesArr = this._overflowBlock.querySelectorAll('[data-component="slide"]');
    slidesArr[this._slidesCount+1].classList.remove('selected');
    slidesArr[0].classList.remove('selected');
    this._isMoving = false;
};

Slider.prototype._moveOverTime = function () {
    this._moveTimer = setTimeout(function() {
        if (!this._elem) return;
        if (!this._isMoving) {
            this._moveSlideForward.bind(this)();
        }
        this._moveOverTime.bind(this)();
    }.bind(this), this._moveDelay);
};

module.exports = Slider;