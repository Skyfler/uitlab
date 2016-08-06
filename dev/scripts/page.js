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
    /*var Slider = require('./slider.js');*/
    var VerticalSlider = require('./vertical-slider.js');
    var CustomUploadButton = require('./custom-upload-button.js');
    var CustomSelect = require('./customselect.js');
    var FormSwitcher = require('./formswitcher');
    /*var Masonry = require('masonry-layout');*/
    var MasonryTabs = require('./masonry-tabs');
    
    var mainMenu = new Menu({
        elem: document.querySelector('#main_menu')
    });

    var verticalSliderElem = document.querySelector('#vertical-slider');
    if (verticalSliderElem) {
        window.verticalSlide = new VerticalSlider({
            elem: verticalSliderElem,
            desktopHeight: 699,                                 //px
            mobileHeight: 441,                                  //px
            openSlideHeightDesktop: 515,                        //px
            openSlideHeightMobile: 332,                         //px
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

    var mapElem = document.querySelector('#map');
    if (mapElem) {
        var pos = {lat: 49.99335, lng: 36.23237};
        var map = new google.maps.Map(mapElem, {
            zoom: 6,
            center: pos,
            streetViewControl: false,
            mapTypeControl: false,
            scrollwheel: false,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "saturation": 36
                        },
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 40
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 20
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 17
                        },
                        {
                            "weight": 1.2
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 20
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 21
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 17
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 29
                        },
                        {
                            "weight": 0.2
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 18
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 19
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 17
                        }
                    ]
                }
            ]
        });

        var marker = new google.maps.Marker({
            // icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            icon: 'img/icon_mapmarker.png',
            position: pos,
            map: map,
            title: 'г. Харьков, ул. Сумская, 2'
        });
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