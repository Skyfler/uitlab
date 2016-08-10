"use strict";

function Dropdown(options) {
    this._elem = options.elem;
    this._openBtn = this._elem.querySelector('[data-component="dropdown_toggle"]');
    if (this._elem.classList.contains('open')) {
        this._state = 'open';
    } else {
        this._state = 'closed';
    }

    this._elem.addEventListener('click', this._onClick.bind(this));
}

Dropdown.prototype._onClick = function(e) {
    var target = e.target;

    this._toggleDropdown.bind(this)(target, e);
};

Dropdown.prototype._toggleDropdown = function(target, e) {

    if (this._openBtn.contains(target)) {
        e.preventDefault();

        if (this._state === 'closed') {
            this._openDropdown.bind(this)();
        } else {
            this._closeDropdown.bind(this)();
        }
    }
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