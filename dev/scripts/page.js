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

    var Polyfils = require('./polyfils');
    var Menu = require('./dropdown-menu.js');
    var GMapController = require('./gmapController');
    var AjaxPaginator = require('./ajaxPaginator');
    /*var Dropdown = require('./dropdown.js');
    var Slider = require('./slider.js');
    var VerticalSlider = require('./vertical-slider.js');
    var CustomUploadButton = require('./custom-upload-button.js');
    var CustomSelect = require('./customselect.js');
    var FormSwitcher = require('./formswitcher');
    var MasonryTabs = require('./masonry-tabs');
    var AnimatedCircle = require('./animated-circle');*/

    Polyfils.runAll();

    var mainMenu = new Menu({
        elem: document.querySelector('#main_menu'),
        transitionDuration: 0.5,
        openBtnSelector: '[data-component="dropdown_toggle"]',
        dropdownContainerSelector: '.dropdown_container',
        dropdownBarSelector: '.dropdown_bar',
        closeOnResize: true,
        listenToCloseSignal: true,
        cancelDropdownOnGreaterThan: 799
    });

    // var mapElem = document.querySelector('#map');
    var pos = {lat: 49.99335, lng: 36.23237};
    var gMap = new GMapController({
        elem: null,
        gMapOptions: {
            zoom: 4,
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
        },
        markers: [{
            icon: 'img/icon_mapmarker.png',
            position: pos,
            title: 'г. Харьков, ул. Сумская, 2'
        }]
    });

    var ajaxPaginator = new AjaxPaginator({
        startLabel: '<!--[if !IE]>main_beginnig<![endif]-->',
        endLabel: '<!--[if !IE]>main_end<![endif]-->',
        transitionDuration: 0.2,
        innerPageClass: 'main',
        mapInstance: gMap
    });

})();