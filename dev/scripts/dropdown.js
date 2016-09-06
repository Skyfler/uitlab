"use strict";

var Helper = require('./helper');

function Dropdown(options) {
    Helper.call(this, options);

    this._elem = options.elem;
    this._openBtnSelector = '[data-component="dropdown_toggle"]';
    if (this._elem.classList.contains('open')) {
        this._state = 'open';
    } else {
        this._state = 'closed';
    }

    this._onClick = this._onClick.bind(this);

    this._addListener(this._elem, 'click', this._onClick);
}

Dropdown.prototype = Object.create(Helper.prototype);
Dropdown.prototype.constructor = Dropdown;

Dropdown.prototype._onClick = function(e) {
    var target = e.target;

    this._toggleDropdown(target, e);

    return target;
};

Dropdown.prototype._toggleDropdown = function(target, e) {
    var dropdownToggle;

    if (target) {
        dropdownToggle = target.closest(this._openBtnSelector);
    } else {
        dropdownToggle = true;
    }

    if (dropdownToggle) {
        if (e) {
            e.preventDefault();
        }

        if (this._state === 'closed') {
            this._openDropdown();
        } else {
            this._closeDropdown();
        }

        return true;
    }

    return false;
};

Dropdown.prototype._openDropdown = function() {
    var dropdownContainer = this._elem.querySelector('.dropdown_container');
    var dropdownBar = dropdownContainer.querySelector('.dropdown_bar');

    this._state = 'open';
    this._elem.classList.add('open');
    this._elem.classList.remove('closed');
    dropdownContainer.style.height = dropdownBar.offsetHeight + 'px';
    this._elem.classList.remove('collapsed');
    setTimeout(function(){
        if (!dropdownContainer) return;
        dropdownContainer.style.height = '';
    }, 500);
};

Dropdown.prototype._closeDropdown = function() {
    this._state = 'closed';
    this._elem.classList.add('closed');
    this._elem.classList.remove('open');
    this._elem.classList.add('collapsed');
};

module.exports = Dropdown;