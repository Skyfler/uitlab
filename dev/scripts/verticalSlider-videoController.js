"use strict";

var CONSTANTS = require('./verticalSlider-constants');
var Helper = require('./helper');

function VideoController(options) {
    Helper.call(this, options);

    this._slidesArr = options.slidesArr;

    this._onVideoLoaded = this._onVideoLoaded.bind(this);
    this._onVideoEnd = this._onVideoEnd.bind(this);
    this._startVideo = this._startVideo.bind(this);

    this._init();
}

VideoController.prototype = Object.create(Helper.prototype);
VideoController.prototype.constructor = VideoController;

VideoController.prototype._init = function() {
    for (var i = 0; i < this._slidesArr.length; i ++) {
        this._slidesArr[i]._videoElem = this._slidesArr[i]._elem.querySelector('video');
        if (this._slidesArr[i]._videoElem.readyState === 4) {
            this._onVideoLoaded({target: this._slidesArr[i]._videoElem});
        } else {
            // this._slidesArr[i]._videoElem.addEventListener('loadeddata', this._onVideoLoaded);
            this._addListener(this._slidesArr[i]._videoElem, 'loadeddata', this._onVideoLoaded);
        }
        // this._slidesArr[i]._videoElem.addEventListener('ended', this._onVideoEnd);
        this._addListener(this._slidesArr[i]._videoElem, 'ended', this._onVideoEnd);
        this._addListener(this._slidesArr[i]._elem, 'startVideo', this._startVideo);

        this._slidesArr[i]._videoState = CONSTANTS.videoStateVals.stoped;
    }
};

VideoController.prototype._onVideoLoaded = function(e) {
    var target = e.target;
    var slide = this._getSlideByVideoElem(target);

    if (!slide) return;

    slide._videoIsLoaded = true;

    var widgetEvent = new CustomEvent("videoisloaded", {
        bubbles: true
    });

    slide._elem.dispatchEvent(widgetEvent);
};

VideoController.prototype._onVideoEnd = function(e) {
    var target = e.target;
    target.play();
};

VideoController.prototype._getSlideByVideoElem = function(videoElem) {
    for (var i = 0; i < this._slidesArr.length; i++) {
        if (this._slidesArr[i]._videoElem === videoElem) {
            return this._slidesArr[i];
        }
    }
    return false;
};

VideoController.prototype._startVideo = function(e) {
    var slide = e.detail.slide;
    slide._videoElem.play();
    slide._videoState = CONSTANTS.videoStateVals.playing;
};

VideoController.prototype.startVideo = function(slide) {
    slide._videoElem.play();
    slide._videoState = CONSTANTS.videoStateVals.playing;
};

VideoController.prototype.resetVideo = function(slide) {
    slide._videoElem.pause();
    slide._videoElem.currentTime = 0;
    slide._videoState = CONSTANTS.videoStateVals.stoped;
};

module.exports = VideoController;