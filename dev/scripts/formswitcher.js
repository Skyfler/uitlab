"use strict";

var Helper = require('./helper');
var FormValidator = require('./formValidator');

function FormSwitcher(options) {
    Helper.call(this, options);

    this._elem = options.elem;
    this._formValidator = new FormValidator({
        selectArr: options.selectArr,
        uploadArr: options.uploadArr
    });
    this._selectArr = options.selectArr;
    this._uploadArr = options.uploadArr;

    this._manageDependencies();

    this._succsessNotificationHTML = '<div class="success_notification">' +
        '<p>Thank you for fiiling up the form</p>' +
        '<p>We will contact You ASAP!</p>' +
        '</div>';

    this._onSentRequest = this._onSentRequest.bind(this);
    this._onGotResponse = this._onGotResponse.bind(this);
    this._onCustomSelect = this._onCustomSelect.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onCustomSelectOpenCloseEvent = this._onCustomSelectOpenCloseEvent.bind(this);

    this._addListener(this._elem, 'customselect', this._onCustomSelect);
    this._addListener(this._elem, 'sentrequest', this._onSentRequest);
    this._addListener(this._elem, 'customselectopenclose', this._onCustomSelectOpenCloseEvent);
    this._addListener(this._elem, 'click', this._onClick);
}

FormSwitcher.prototype = Object.create(Helper.prototype);
FormSwitcher.prototype.constructor = FormSwitcher;

FormSwitcher.prototype.remove = function() {
    this._destroyFormValidator();

    Helper.prototype.remove.apply(this, arguments);
};

FormSwitcher.prototype._destroyFormValidator = function() {
    if (this._formValidator && this._formValidator.remove) {
        this._formValidator.remove();
    }
};

FormSwitcher.prototype._onClick = function(e) {
    var target = e.target;

    this._switchForm(target, e);
};

FormSwitcher.prototype._switchForm = function(target, e) {
    var control = target.closest('[data-component="switch_control"]');
    if (control) {
        e.preventDefault();
        
        this._elem.classList.toggle('form1_visible');
        this._elem.classList.toggle('form2_visible');
    }
};

FormSwitcher.prototype._onSentRequest = function() {
    // this._elem.style.display = 'none';
    this._elem.classList.add('waiting_for_response');
    this._addListener(this._elem, 'gotresponse', this._onGotResponse);

    // console.log('Caught "sentrequest" event');
};

FormSwitcher.prototype._onGotResponse = function(e) {
    // this._elem.style.display = '';
    this._elem.classList.remove('waiting_for_response');
    this._removeListener(this._elem, 'gotresponse', this._onGotResponse);

    // console.log('Caught "gotresponse" event');

    if (e.detail.success) {
        // alert('Sucsess!');
        this._elem.innerHTML = this._succsessNotificationHTML;
    } else {
        // console.log('Error!');
        this._showErrorNotification();
    }
};

/*FormSwitcher.prototype._showErrorNotification = function() {
    this._cover = document.createElement('div');
    this._cover.style.cssText = 'z-index: 1000; position: fixed; height: 100%; width: 100%; top: 0; left: 0; background: rgba(255, 255, 255, 0.25)';
    this._cover.innerHTML = this._errorNotificationHTML;

    document.body.insertAdjacentElement('afterBegin', this._cover);
    document.body.style.overflow = 'hidden';
    this._addListener(document.body, 'click', this._closeErrorNotification);
};

FormSwitcher.prototype._closeErrorNotification = function(e) {
    var target = e.target;
    if (target.tagName !== 'BUTTON') return;

    document.body.removeChild(this._cover);
    delete this._cover;
    document.body.style.overflow = '';
    this._removeListener(document.body, 'click', this._closeErrorNotif);
};*/

FormSwitcher.prototype._onCustomSelect = function(e) {
    var target = e.target,
        value = e.detail.title;

    this._checkDependencies(target, value);
};

FormSwitcher.prototype._checkDependencies = function(target, value) {

    for (var dependencyElem in this._dependencies) {

        if (target.matches(dependencyElem)) {

            for (var dependencyValue in this._dependencies[dependencyElem]) {

                if (value === dependencyValue) {
                    this._dependencies[dependencyElem][dependencyValue].revealByDependency();
                } else {
                    this._dependencies[dependencyElem][dependencyValue].hideByDependency();
                }

            }

        }
    }
};

FormSwitcher.prototype._manageDependencies = function() {
    this._dependencies = {};
    var elem,
        dependencyStr,
        dependencyElem,
        dependencyValue;

    for (var i = 0; i < this._selectArr.length; i++) {
        elem = this._selectArr[i].returnElem();

        if (elem.dataset.dependency) {
            dependencyStr = elem.dataset.dependency;

            if (dependencyStr.indexOf('>') !== -1) {
                dependencyElem = dependencyStr.slice(0, dependencyStr.indexOf('>'));
                dependencyValue = dependencyStr.slice(dependencyStr.indexOf('>') + 1);

                this._dependencies[dependencyElem] = {};
                this._dependencies[dependencyElem][dependencyValue] = this._selectArr[i];

                this._selectArr[i].hideByDependency();
            }
        }
    }

};

FormSwitcher.prototype._onCustomSelectOpenCloseEvent = function(e) {
    var customSelect = e.target;
    var inputGroup = customSelect.closest('.input_group');

    if (!inputGroup) return;

    if (e.detail.open) {
        inputGroup.style.zIndex = '1000';
    } else if (!e.detail.open) {
        inputGroup.style.zIndex = '';
    }
};

module.exports = FormSwitcher;