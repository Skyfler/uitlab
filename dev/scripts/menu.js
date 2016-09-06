"use strict";

var Dropdown = require('./dropdown.js');

function Menu(options) {
    Dropdown.call(this, options);

    this._addListener(window, 'resize', this._onSignalToCloseMenu.bind(this));
    this._addListener(document, 'signaltoclosemenu', this._onSignalToCloseMenu.bind(this));
}

Menu.prototype = Object.create(Dropdown.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype._onClick = function(e) {
    var target = Dropdown.prototype._onClick.apply(this, arguments);

    this._preventDefaultCheck(e);
    this._toggleSubMenu(target);
};

Menu.prototype._toggleDropdown = function(target, e) {
    if (Dropdown.prototype._toggleDropdown.apply(this, arguments) && this._openedSubMenu) {
        this._closeSubMenu(this._openedSubMenu);
    }
};

Menu.prototype._toggleSubMenu = function(target) {
    var submenuToggleBtn = target.closest('[data-component="submenu_toggle"]');

    if (submenuToggleBtn) {
        var submenuContainer = submenuToggleBtn.closest('[data-component="submenu_container"]');

        if ('closed' === submenuContainer.dataset.state) {
            if (this._openedSubMenu) {
                this._closeSubMenu(this._openedSubMenu);
            }
            this._openSubMenu(submenuContainer);
        } else {
            this._closeSubMenu(submenuContainer);
        }
    }
};

Menu.prototype._openSubMenu = function(submenuContainer) {
    this._openedSubMenu = submenuContainer;
    var submenuBar = submenuContainer.querySelector('.submenu_bar');
    var submenu = submenuBar.querySelector('.submenu');

    submenuContainer.dataset.state = 'open';
    submenuContainer.classList.add('open');
    submenuContainer.classList.remove('closed');
    submenuBar.style.height = submenu.offsetHeight + 'px';
    submenuContainer.classList.remove('collapsed');
    setTimeout(function(){
        if (!submenuBar) return;
        submenuBar.style.height = '';
    }, 500);
};

Menu.prototype._closeSubMenu = function(submenuContainer) {
    submenuContainer.dataset.state = 'closed';
    submenuContainer.classList.add('closed');
    submenuContainer.classList.remove('open');
    submenuContainer.classList.add('collapsed');
    delete this._openedSubMenu;
};

Menu.prototype._preventDefaultCheck = function(e) {
    if (e.target.hasAttribute('data-preventDefaultUntil') &&
        this._elem.offsetWidth < e.target.getAttribute('data-preventDefaultUntil')) {
        e.preventDefault();
    }
};

Menu.prototype._onSignalToCloseMenu = function(e) {
    // console.log('Got signal to close menu');
    if (this._state === 'open') {
        this._toggleDropdown();
    }
};

module.exports = Menu;