"use strict";

var Dropdown = require('./dropdown.js');

function SubMenu(options) {
    Dropdown.call(this, options);
}

SubMenu.prototype = Object.create(Dropdown.prototype);
SubMenu.prototype.constructor = Dropdown;

SubMenu.prototype._toggleDropdown = function(target, e) {
    if (Dropdown.prototype._toggleDropdown.apply(this, arguments)) {
        var widgetEvent = new CustomEvent('submenutoggle', {
            bubbles: true,
            detail: {
                height: parseFloat(this._dropdownContainer.style.height),
                state: this._state
            }
        });

        this._elem.dispatchEvent(widgetEvent);
    }
};

SubMenu.prototype.toggleDropdownManual = function() {
    Dropdown.prototype._toggleDropdown.apply(this, arguments);
};

module.exports = SubMenu;