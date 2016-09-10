"use strict";

var Dropdown = require('./dropdown.js');
var SubMenu = require('./dropdown-menu-submenu');

function Menu(options) {
    Dropdown.call(this, options);

    this._createSubMenu();

    this._onSubMenuToggle = this._onSubMenuToggle.bind(this);

    this._addListener(this._elem, 'submenutoggle', this._onSubMenuToggle);
}

Menu.prototype = Object.create(Dropdown.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype._openDropdown = function() {
    if (this._subMenuTransition) {
        clearTimeout(this._subMenuTransition);
        delete this._subMenuTransition;
    }
    Dropdown.prototype._openDropdown.apply(this, arguments);
};

Menu.prototype._closeDropdown = function() {
    if (this._subMenuTransition) {
        clearTimeout(this._subMenuTransition);
        delete this._subMenuTransition;
    }
    if (this._openedSubMenu) {
        this._openedSubMenu.toggleDropdownManual();
        delete this._openedSubMenu;
        delete this._openedSubMenuHeight;
    }
    Dropdown.prototype._closeDropdown.apply(this, arguments);
};

Menu.prototype._createSubMenu = function() {
    var subMenuElemArr = this._elem.querySelectorAll('[data-component="submenu_container"]');

    this._subMenuArr = [];
    for (var i = 0; i < subMenuElemArr.length; i++) {
        this._subMenuArr[i] = new SubMenu({
            elem: subMenuElemArr[i],
            transitionDuration: this._transitionDuration,
            openBtnSelector: '[data-component="submenu_toggle"]',
            dropdownContainerSelector: '.submenu_bar',
            dropdownBarSelector: '[data-component="submenu"]',
            cancelDropdownOnGreaterThan: this._cancelDropdownOnGreaterThan
        });
    }
};

Menu.prototype._onSubMenuToggle = function(e) {
    var submenu = this._findSubMenuByElem(e.target);
    // console.log(e);

    if (submenu) {
        if (e.detail.state === 'open') {
            var prevSubMenuHeight = 0;

            if (this._openedSubMenu) {
                this._openedSubMenu.toggleDropdownManual();
                prevSubMenuHeight = this._openedSubMenuHeight;
            }

            this._openedSubMenu = submenu;
            this._openedSubMenuHeight = e.detail.height;

            this._changeDropdownHeight(
                parseFloat(this._dropdownContainer.style.height) + this._openedSubMenuHeight - prevSubMenuHeight,
                this._onSubMenuToggleCallback.bind(this)
            );

        } else {
            this._changeDropdownHeight(
                parseFloat(this._dropdownContainer.style.height) - this._openedSubMenuHeight,
                this._onSubMenuToggleCallback.bind(this)
            );

            delete this._openedSubMenu;
            delete this._openedSubMenuHeight;
        }

    }
};

Menu.prototype._onSubMenuToggleCallback = function() {
    if (this._subMenuTransition) {
        clearTimeout(this._subMenuTransition);
    }

    this._subMenuTransition = setTimeout(function(){
        if (!this._elem || !this._dropdownContainer) return;
        this._removeTransition(this._dropdownContainer);
        delete this._subMenuTransition;
    }.bind(this), this._transitionDuration * 1000);
};

Menu.prototype._findSubMenuByElem = function(elem) {
    for (var i = 0; i < this._subMenuArr.length; i++) {
        if (this._subMenuArr[i]._elem === elem) {
            return this._subMenuArr[i];
        }
    }

    return false;
};

/*Menu.prototype._onClick = function(e) {
    var target = Dropdown.prototype._onClick.apply(this, arguments);

    this._preventDefaultCheck(e);
    this._toggleSubMenu(target);
};*/

/*Menu.prototype._toggleDropdown = function(target, e) {
    if (Dropdown.prototype._toggleDropdown.apply(this, arguments) && this._openedSubMenu) {
        this._closeSubMenu(this._openedSubMenu);
    }
};*/

/*Menu.prototype._toggleSubMenu = function(target) {
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
};*/

/*Menu.prototype._openSubMenu = function(submenuContainer) {
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
};*/

/*Menu.prototype._closeSubMenu = function(submenuContainer) {
    submenuContainer.dataset.state = 'closed';
    submenuContainer.classList.add('closed');
    submenuContainer.classList.remove('open');
    submenuContainer.classList.add('collapsed');
    delete this._openedSubMenu;
};*/



module.exports = Menu;