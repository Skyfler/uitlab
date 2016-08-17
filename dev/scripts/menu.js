"use strict";

var Dropdown = require('./dropdown.js');

function Menu(options) {
    Dropdown.call(this, options);
}

Menu.prototype = Object.create(Dropdown.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype._onClick = function(e) {
    var target = e.target;

    this._preventDefaultCheck.bind(this)(e);
    this._toggleDropdown.bind(this)(target, e);
    this._toggleSubMenu.bind(this)(target);
};

Menu.prototype._toggleSubMenu = function(target) {
    var submenuToggleBtn = target.closest('[data-component="submenu_toggle"]');

    if (submenuToggleBtn) {
        var submenuContainer = submenuToggleBtn.closest('[data-component="submenu_container"]');

        if ('closed' === submenuContainer.dataset.state) {
            this._openSubMenu(submenuContainer);
        } else {
            this._closeSubMenu(submenuContainer);
        }
    }
};

Menu.prototype._openSubMenu = function(submenuContainer) {
    var submenuBar = submenuContainer.querySelector('.submenu_bar');
    var submenu = submenuBar.querySelector('.submenu');

    submenuContainer.dataset.state = 'open';
    submenuContainer.classList.add('open');
    submenuContainer.classList.remove('closed');
    submenuBar.style.height = submenu.offsetHeight + 'px';
    submenuContainer.classList.remove('collapsed');
    setTimeout(function(){
        submenuBar.style.height = '';
    }, 500);
};

Menu.prototype._closeSubMenu = function(submenuContainer) {
    submenuContainer.dataset.state = 'closed';
    submenuContainer.classList.add('closed');
    submenuContainer.classList.remove('open');
    submenuContainer.classList.add('collapsed');
};

Menu.prototype._preventDefaultCheck = function(e) {
    if (e.target.hasAttribute('data-preventDefaultUntil') && this._elem.offsetWidth < e.target.getAttribute('data-preventDefaultUntil')) {
        e.preventDefault();
    }
};

module.exports = Menu;