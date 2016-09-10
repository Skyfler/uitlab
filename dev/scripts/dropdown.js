"use strict";

var Helper = require('./helper');

function Dropdown(options) {
    Helper.call(this, options);

    this._elem = options.elem;
    if (options.cancelDropdownOnGreaterThan) {
        this._cancelDropdownOnGreaterThan = options.cancelDropdownOnGreaterThan;
    }
    this._dropdownContainer = this._elem.querySelector(options.dropdownContainerSelector);
    this._dropdownBar = this._dropdownContainer.querySelector(options.dropdownBarSelector);
    this._transitionDuration = options.transitionDuration || 0.5;
    this._openBtnSelector = options.openBtnSelector;
    if (this._elem.classList.contains('open')) {
        this._state = 'open';
    } else {
        this._state = 'closed';
    }

    this._canceled = this._checkForMaxSizeLimit();

    this._initHeight();

    this._onClick = this._onClick.bind(this);
    this._onSignalToCloseMenu = this._onSignalToCloseMenu.bind(this);
    this._watchForMaxSize = this._watchForMaxSize.bind(this);

    this._addListener(this._elem, 'click', this._onClick);
    if (options.closeOnResize) {
        this._addListener(window, 'resize', this._onSignalToCloseMenu);
    }
    if (options.listenToCloseSignal) {
        this._addListener(document, 'signaltoclosemenu', this._onSignalToCloseMenu);
    }
    if (this._cancelDropdownOnGreaterThan) {
        this._addListener(window, 'resize', this._watchForMaxSize);
    }
}

Dropdown.prototype = Object.create(Helper.prototype);
Dropdown.prototype.constructor = Dropdown;

Dropdown.prototype._initHeight = function() {
    if (this._canceled) return;
    this._dropdownContainer.style.height = this._checkHeight() + 'px';
};

Dropdown.prototype._removeHeight = function() {
    this._dropdownContainer.style.height = '';
};

Dropdown.prototype._onClick = function(e) {
    var target = e.target;

    this._preventDefaultCheck(e);
    if (this._canceled) return;
    this._toggleDropdown(target, e);

    return target;
};

Dropdown.prototype._checkHeight = function() {
    if (this._state === 'closed') {
        return 0;
    } else if (this._state === 'open') {
        return this._dropdownBar.offsetHeight;
    }
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
    // var dropdownContainer = this._elem.querySelector('.dropdown_container');
    // var dropdownBar = dropdownContainer.querySelector('.dropdown_bar');

    this._state = 'open';
    this._elem.classList.add('open');
    this._elem.classList.remove('closed');

    /*this._dropdownContainer.style.height = this._dropdownBar.offsetHeight + 'px';
    console.log('Opening & height = ' + this._dropdownContainer.style.height);
    this._elem.classList.remove('collapsed');*/

    if (this._closeTimer) {
        clearTimeout(this._closeTimer);
        delete this._closeTimer;
    }

    /*this._openTimer = setTimeout(function(){
        if (!this._elem || !dropdownContainer) return;
        delete this._openTimer;
        dropdownContainer.style.height = '';
        console.log('Opening & height = ' + dropdownContainer.style.height);
    }.bind(this), 500);*/

    this._changeDropdownHeight(this._checkHeight(), function(){
        this._openTimer = setTimeout(function(){
            if (!this._elem || !this._dropdownContainer) return;
            delete this._openTimer;
            this._removeTransition(this._dropdownContainer);
        }.bind(this), this._transitionDuration * 1000);
    }.bind(this));
};

/*Dropdown.prototype._closeDropdown = function() {
    this._state = 'closed';
    this._elem.classList.add('closed');
    this._elem.classList.remove('open');
    this._elem.classList.add('collapsed');
};*/

Dropdown.prototype._closeDropdown = function() {
    // var dropdownContainer = this._elem.querySelector('.dropdown_container');
    // var dropdownBar = dropdownContainer.querySelector('.dropdown_bar');

    /*this._dropdownContainer.style.height = this._dropdownBar.offsetHeight + 'px';
    console.log('Closing & height = ' + this._dropdownContainer.style.height);*/

    this._state = 'closed';
    this._elem.classList.remove('open');
    // dropdownContainer.style.height = 0 + 'px';

    if (this._openTimer) {
        clearTimeout(this._openTimer);
        delete this._openTimer;
    }

    this._changeDropdownHeight(this._checkHeight(), function(){
        this._closeTimer = setTimeout(function(){
            if (!this._elem || !this._dropdownContainer) return;
            delete this._closeTimer;
            this._removeTransition(this._dropdownContainer);
            this._elem.classList.add('closed');
        }.bind(this), this._transitionDuration * 1000);
    }.bind(this));

    /*setTimeout(function(){
        if (!this._elem || !dropdownContainer) return;
        this._elem.classList.add('collapsed');

        dropdownContainer.style.height = 0 + 'px';
        console.log('Closing & height = ' + dropdownContainer.style.height);

        this._closeTimer = setTimeout(function(){
            if (!this._elem || !dropdownContainer) return;
            delete this._closeTimer;
            this._elem.classList.add('closed');

            dropdownContainer.style.height = '';
            console.log('Closing & height = ' + dropdownContainer.style.height);
        }.bind(this), 500);
    }.bind(this), 10);*/
};

Dropdown.prototype._changeDropdownHeight = function(newHeight, callback) {
    this._addTransition(this._dropdownContainer);
    this._dropdownContainer.style.height = newHeight + 'px';
    callback();
};

Dropdown.prototype._addTransition = function(elem) {
    elem.style.transitionProperty = 'height';
    elem.style.transitionTiminFunction = 'ease';
    elem.style.transitionDelay = 0 + 's';
    elem.style.transitionDuration = this._transitionDuration + 's';
};

Dropdown.prototype._removeTransition = function(elem) {
    elem.style.transitionProperty = '';
    elem.style.transitionTiminFunction = '';
    elem.style.transitionDelay = '';
    elem.style.transitionDuration = '';
};

Dropdown.prototype._preventDefaultCheck = function(e) {
    if (e.target.hasAttribute('data-preventDefaultUntil') &&
        this._elem.offsetWidth < e.target.getAttribute('data-preventDefaultUntil')) {
        e.preventDefault();
    }
};

Dropdown.prototype._onSignalToCloseMenu = function(e) {
    // console.log('Got signal to close menu');

    if (this._state === 'open') {
        this._toggleDropdown();
    }
};

Dropdown.prototype._checkForMaxSizeLimit = function() {
    return this._cancelDropdownOnGreaterThan && window.innerWidth > this._cancelDropdownOnGreaterThan
};

Dropdown.prototype._watchForMaxSize = function() {
    if (this._canceled && !this._checkForMaxSizeLimit()) {
        this._canceled = false;
        this._initHeight();
    } else if (!this._canceled && this._checkForMaxSizeLimit()) {
        this._canceled = true;
        this._removeHeight();
    }

};

module.exports = Dropdown;