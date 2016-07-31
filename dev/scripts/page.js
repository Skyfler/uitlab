"use strict";

/*console.log("Before addEventListener 'DOMContentLoaded'");
document.addEventListener("DOMContentLoaded", ready);
document.addEventListener("DOMContentLoaded", ready2);
console.log("After addEventListener 'DOMContentLoaded'");*/
/*
function ready2() {
    console.log("DOMContentLoaded");
}*/

(function ready() {
    
    var Menu = require('./menu.js');
    var Slider = require('./slider.js');
    var CustomUploadButton = require('./custom-upload-button.js');
    var CustomSelect = require('./customselect.js');
    var FormSwitcher = require('./formswitcher');
    /*var Masonry = require('masonry-layout');*/
    var MasonryTabs = require('./masonry-tabs');
    
    var mainMenu = new Menu({
        elem: document.querySelector('#main_menu')
    });

    var horizontalCarouselElem = document.querySelector('#horizontal_carousel');
    if (horizontalCarouselElem) {
        var horizontalCarousel = new Slider({
            elem: horizontalCarouselElem,
            delay: 0
        });
    }

    var masonryTabsElem = document.querySelector('.masonry-tabs');
    if (masonryTabsElem) {
        var masonryTabs = new MasonryTabs({
            elem: masonryTabsElem,
            itemsGroupClassArr: ['grid-item', 'web-design', 'front-end', 'back-end'],
            masonryOptionsObj: {
                itemSelector: '.grid-item',
                columnWidth: '.grid-item',
                /*fitWidth: true,*/
                percentPosition: true
            }
        })
    }

    /*var masonryGridElem = document.querySelector('.masonry-grid');
    if (masonryGridElem) {
        var msnry = new Masonry( masonryGridElem, {
            // options
             itemSelector: '.grid-item',
             columnWidth: '.grid-item',
             fitWidth: true
        });

        document.addEventListener("DOMContentLoaded", function() {
            setTimeout(function() {
                console.log('msnry.layout');
                msnry.layout();
            }, 1000);
        })
    }*/
    
    var formswithcerElem = document.querySelector('#formswithcer');
    if (formswithcerElem) {
        var formSwitcher = new FormSwitcher({
            elem: formswithcerElem
        });
    }

    var customSelectElemArr = document.querySelectorAll('.customselect');
    if (customSelectElemArr.length > 0) {
        var customSelectArr = [];
        
        for (var i = 0; i < customSelectElemArr.length; i++) {
            /*console.log('Custom select ' + i +':');
            console.log(customSelectElemArr[i]);*/
            customSelectArr[i] = new CustomSelect({
                elem: customSelectElemArr[i]
            });
        }
        
    }

    var customUploadButtonElemArr = document.querySelectorAll('.uploadbutton');
    if (customUploadButtonElemArr.length > 0) {
        var customUploadButtonArr = [];

        for (var i = 0; i < customUploadButtonElemArr.length; i++) {
            /*console.log('Custom upload button ' + i +':');
            console.log(customUploadButtonElemArr[i]);*/
            customUploadButtonArr[i] = new CustomUploadButton({
                elem: customUploadButtonElemArr[i]
            });
        }

    }

})();