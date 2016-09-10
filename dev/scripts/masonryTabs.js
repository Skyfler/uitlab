"use strict";

var Helper = require('./helper');
var Masonry = require('masonry-layout');

function MasonryTabs(options) {
    Helper.call(this, options);

    this._elem = options.elem;
    this._masonryItemsContainer = this._elem.querySelector('.masonry-items-container');

    this._getItemGroups(options.itemsGroupClassArr);
    this._initMasonry(options.masonryOptionsObj);
    this._resetActiveTab();

    this._onClick = this._onClick.bind(this);
    this._onDOMContentLoaded = this._onDOMContentLoaded.bind(this);

    // this._elem.addEventListener('click', this._onClick);
    this._addListener(this._elem, 'click', this._onClick);
    /*------ FIX FOR FIRST LAYOUT -------*/
    this._addListener(document, 'DOMContentLoaded', this._onDOMContentLoaded);
}

MasonryTabs.prototype = Object.create(Helper.prototype);
MasonryTabs.prototype.constructor = MasonryTabs;

MasonryTabs.prototype._onDOMContentLoaded = function() {
    setTimeout(function() {
        if (!this._elem) return;
        this._masonry.layout();
    }.bind(this), 1000);
};

MasonryTabs.prototype.remove = function() {
    this._destroyMasonry();
    Helper.prototype.remove.apply(this, arguments);
};

MasonryTabs.prototype._getItemGroups = function(itemsGroupClassArr) {
    this._itemGroupsObject = {};
    var itemArr;

    for (var i = 0; i < itemsGroupClassArr.length; i++) {

        itemArr = this._masonryItemsContainer.querySelectorAll('.' + itemsGroupClassArr[i]);
        this._itemGroupsObject[itemsGroupClassArr[i]] = [];

        for (var j = 0; j < itemArr.length; j++) {
            this._itemGroupsObject[itemsGroupClassArr[i]].push(itemArr[j].cloneNode(true));
        }
    }
};

MasonryTabs.prototype._initMasonry = function(masonryOptionsObj) {
    this._masonry = new Masonry( this._masonryItemsContainer, masonryOptionsObj);
};

MasonryTabs.prototype._destroyMasonry = function() {
    this._masonry.destroy();
};

MasonryTabs.prototype._removeAllItems = function() {
    this._masonry.remove( this._masonryItemsContainer.querySelectorAll('.grid-item') );

    this._masonry.layout();
};

MasonryTabs.prototype._appendItemsGroup = function(itemsGroupName) {
    if (!this._itemGroupsObject.hasOwnProperty(itemsGroupName)) return;

    var fragment = document.createDocumentFragment();
    var itemsToInsert = [];
    var clonedItem;

    // var maxVal = this._itemGroupsObject[itemsGroupName].length;
    var maxVal = this._itemGroupsObject[itemsGroupName].length > 10 ? 10 : this._itemGroupsObject[itemsGroupName].length;

    for (var i = 0; i < maxVal; i++) {
        clonedItem = this._itemGroupsObject[itemsGroupName][i].cloneNode(true);
        /*if (itemsGroupName !== 'grid-item') {
            this._changeHeightClassTo3.bind(this)(clonedItem);
        }*/
        itemsToInsert.push(clonedItem);
        fragment.appendChild(clonedItem);
    }

    this._masonryItemsContainer.appendChild(fragment);
    this._masonry.appended( itemsToInsert );

    this._masonry.layout();

};

MasonryTabs.prototype._changeHeightClassTo3 = function(item) {
    if (item.classList.contains('grid-item--height1')) {
        item.classList.remove('grid-item--height1');
        item.classList.add('prev--height1');
    }
    if (item.classList.contains('grid-item--height2')) {
        item.classList.remove('grid-item--height2');
        item.classList.add('prev--height2');
    }
    item.classList.add('grid-item--height3');
};

MasonryTabs.prototype._onClick = function(e) {
    var target = e.target;

    this._setActiveTab.bind(this)(this._getTab(target));
};

MasonryTabs.prototype._getTab = function(elem) {
    return elem.closest('.tab');
};

MasonryTabs.prototype._setActiveTab = function(tab) {
    if (!tab || tab === this._activeTab) return;

    this._activeTab.classList.remove('active');
    tab.classList.add('active');
    this._activeTab = tab;

    this._refreshMasonryContainer.bind(this)();
};

MasonryTabs.prototype._resetActiveTab = function() {
    var tabsArr = this._elem.querySelectorAll('.tab');

    for (var i = 0; i < tabsArr.length; i++) {
        if (tabsArr[i].classList.contains('active')) {
            tabsArr[i].classList.remove('active');
        }
    }

    tabsArr[0].classList.add('active');
    this._activeTab = tabsArr[0];

    this._refreshMasonryContainer.bind(this)();
};

MasonryTabs.prototype._refreshMasonryContainer = function() {
    this._removeAllItems.bind(this)();
    this._appendItemsGroup.bind(this)(this._activeTab.dataset.showItemsGroup);
};

module.exports = MasonryTabs;