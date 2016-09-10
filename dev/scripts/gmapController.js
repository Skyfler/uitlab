"use strict";

function GMapController(options) {
    this._elem = options.elem;
    this._initialMapOptions = options.gMapOptions;
    this._markersToSet = options.markers;

    this._initMap();
}

GMapController.prototype._initMap = function() {
    if (!this._elem) return;
    // console.log('Init New Map!');

    this._map = new google.maps.Map(this._elem, this._initialMapOptions);
    this._setMarkers(this._markersToSet);
};

GMapController.prototype._setMarkers = function(markersToSet) {
    if (markersToSet && markersToSet.length > 0) {
        this._markerArr = [];
        var marker;

        for (var i = 0; i < markersToSet.length; i++) {
            markersToSet[i].map = this._map;
            marker = new google.maps.Marker(markersToSet[i]);

            this._markerArr.push(marker);
        }
    }
};

GMapController.prototype.remove = function(containerElem) {
    if (!this._map || !containerElem.contains(this._elem)) return;
    this._elem.parentNode.removeChild(this._elem);
};

GMapController.prototype.insertMap = function(element) {
    if (this._map) {
        this._map.setCenter(this._initialMapOptions.center);
        this._map.setZoom(this._initialMapOptions.zoom);
        element.parentNode.replaceChild(this._elem, element);
    } else {
        this._elem = element;
        this._initMap();
    }
};

module.exports = GMapController;