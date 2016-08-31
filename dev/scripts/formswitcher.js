"use strict";

var FormValidator = require('./form-validator');

function FormSwitcher(options) {
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
    this._errorNotificationHTML = '<div class="error_notification">' +
        '<p>An Error Occurred!</p>' +
        '<p>Please Try Again Later.</p>' +
        '<button>ОК</button>' +
        '</div>';

    this._onSentRequest = this._onSentRequest.bind(this);
    this._onGotResponse = this._onGotResponse.bind(this);

    this._elem.addEventListener('customselect', this._onCustomSelect.bind(this));
    this._elem.addEventListener('sentrequest', this._onSentRequest);
    this._elem.addEventListener('click', this._onClick.bind(this));
}

FormSwitcher.prototype._onClick = function(e) {
    var target = e.target;

    this._switchForm.bind(this)(target, e);
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
    this._elem.addEventListener('gotresponse', this._onGotResponse);

    // console.log('Caught "sentrequest" event');
};

FormSwitcher.prototype._onGotResponse = function(e) {
    // this._elem.style.display = '';
    this._elem.classList.remove('waiting_for_response');
    this._elem.removeEventListener('gotresponse', this._onGotResponse);

    // console.log('Caught "gotresponse" event');

    if (e.detail.success) {
        // alert('Sucsess!');
        this._elem.innerHTML = this._succsessNotificationHTML;
    } else {
        // console.log('Error!');
        this._showErrorNotification();
    }
};

FormSwitcher.prototype._showErrorNotification = function() {
    var cover = document.createElement('div');
    cover.style.cssText = 'z-index: 1000; position: fixed; height: 100%; width: 100%; top: 0; left: 0; background: rgba(255, 255, 255, 0.25)';
    cover.innerHTML = this._errorNotificationHTML;

    document.body.insertAdjacentElement('afterBegin', cover);
    document.body.style.overflow = 'hidden';
    document.body.addEventListener('click', closeErrorNotif);

    function closeErrorNotif(e) {
        var target = e.target;
        if (target.tagName !== 'BUTTON') return;

        document.body.removeChild(cover);
        document.body.style.overflow = '';
        document.body.removeEventListener('click', closeErrorNotif);
    }
};

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

module.exports = FormSwitcher;