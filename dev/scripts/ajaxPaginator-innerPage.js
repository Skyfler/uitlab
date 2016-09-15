"use strict";

var Dropdown = require('./dropdown.js');
var Slider = require('./slider.js');
var VerticalSlider = require('./verticalSlider.js');
var CustomUploadButton = require('./customUploadButton.js');
var CustomSelect = require('./customSelect.js');
var FormSwitcher = require('./formswitcher');
var MasonryTabs = require('./masonryTabs');
var AnimatedCircle = require('./animatedCircle');

function InnerPage(innerPageElem, mapInstance) {
    this._innerPageElem = innerPageElem;

    this._gMap = mapInstance;
    var mapElem = innerPageElem.querySelector('#map');
    if (mapElem) {
        this._gMap.insertMap(mapElem);
    }

    var verticalSliderElem = innerPageElem.querySelector('#vertical-slider');
    if (verticalSliderElem) {
        this._verticalSlider = new VerticalSlider({
            elem: verticalSliderElem,
            minDesktopHeight: 520,                                 //px
            minMobileHeight: 395,                                  //px
            collapsedSlideHeightDesktop: 92,                        //px
            collapsedSlideHeightMobile: 54.5,                         //px
            transitionDuration: 400                             //ms
        });
    }

    /*var horizontalCarouselElem = document.querySelector('#horizontal_carousel');
     if (horizontalCarouselElem) {
     var horizontalCarousel = new Slider({
     elem: horizontalCarouselElem,
     delay: 0
     });
     }*/

    var masonryTabsElem = innerPageElem.querySelector('.masonry-tabs');
    if (masonryTabsElem) {
        this._masonryTabs = new MasonryTabs({
            elem: masonryTabsElem,
            itemsGroupClassArr: ['grid-item', 'front-end', 'cms', 'ecommerce', 'custom'],
            masonryOptionsObj: {
                itemSelector: '.grid-item',
                columnWidth: '.grid-item',
                /*fitWidth: true,*/
                percentPosition: true
            }
        })
    }

    var sliderElem = innerPageElem.querySelector('.slider');
    if (sliderElem) {
        this._slider = new Slider({
            elem: sliderElem,
            delay: 0
        });
    }

    var dropdownElemArr = innerPageElem.querySelectorAll('.dropdown');
    if (dropdownElemArr.length > 0) {
        this._dropdownArr = [];

        for (var i = 0; i < dropdownElemArr.length; i++) {
            this._dropdownArr[i] = new Dropdown({
                elem: dropdownElemArr[i],
                openBtnSelector: '[data-component="dropdown_toggle"]',
                dropdownContainerSelector: '.dropdown_container',
                dropdownBarSelector: '.dropdown_bar',
                transitionDuration: 0.5,
                closeOnResize: true
            });
        }

    }

    var animatedCircleElemArr = innerPageElem.querySelectorAll('.animated_circle');
    if (animatedCircleElemArr.length > 0) {
        this._animatedCircleArr = [];

        for (var i = 0; i < animatedCircleElemArr.length; i++) {
            this._animatedCircleArr[i] = new AnimatedCircle({
                elem: animatedCircleElemArr[i],
                delayBeforeStop: 3000                   //ms
            });
        }

    }

    var customSelectElemArr = innerPageElem.querySelectorAll('.customselect');
    this._customSelectArr = [];
    if (customSelectElemArr.length > 0) {

        for (var i = 0; i < customSelectElemArr.length; i++) {
            /*console.log('Custom select ' + i +':');
             console.log(customSelectElemArr[i]);*/
            this._customSelectArr[i] = new CustomSelect({
                elem: customSelectElemArr[i]
            });
        }

    }

    var customUploadButtonElemArr = innerPageElem.querySelectorAll('.uploadbutton');
    this._customUploadButtonArr = [];
    if (customUploadButtonElemArr.length > 0) {

        for (var i = 0; i < customUploadButtonElemArr.length; i++) {
            /*console.log('Custom upload button ' + i +':');
             console.log(customUploadButtonElemArr[i]);*/
            this._customUploadButtonArr[i] = new CustomUploadButton({
                elem: customUploadButtonElemArr[i]
            });
        }

    }

    var formswithcerElem = innerPageElem.querySelector('.formswitcher_container');
    if (formswithcerElem) {
        this._formSwitcher = new FormSwitcher({
            elem: formswithcerElem,
            selectArr: this._customSelectArr,
            uploadArr: this._customUploadButtonArr
        });
    }
}

InnerPage.prototype.remove = function() {
    for (var key in this) {
        if (this.hasOwnProperty(key) && key !== '_innerPageElem') {

            if (Array.isArray(this[key])) {
                for (var i = this[key].length - 1; i >= 0 ; i--) {
                    this[key][i].remove();

                    this[key].pop();
                }
            } else {
                this[key].remove(this._innerPageElem);
            }

            delete this[key];
        }
    }

    delete this._innerPageElem;
};

module.exports = InnerPage;