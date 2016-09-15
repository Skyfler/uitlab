"use strict";

var Helper = require('./helper');

function FormValidator(options) {
    Helper.call(this, options);

    this._selectArr = options.selectArr;
    this._uploadArr = options.uploadArr;

    this._waitingForResponse = false;

    this._onSubmit = this._onSubmit.bind(this);
    this._onFocus = this._onFocus.bind(this);

    this._addListener(document, 'submit', this._onSubmit);
}

FormValidator.prototype = Object.create(Helper.prototype);
FormValidator.prototype.constructor = FormValidator;

FormValidator.prototype._onSubmit = function(e) {
    e.preventDefault();

    // console.log('this._waitingForResponse is set to ' + this._waitingForResponse);

    if(this._waitingForResponse) {
        // console.log('Already sent form!');
        return;
    }

    var form = e.target;

    this._sumitingForm = form;

    this._processForm(form);
};

FormValidator.prototype._processForm = function(form) {
    var inputsArr = form.querySelectorAll('[data-component="form-input"]');
    if (inputsArr.length === 0) return;

    var dataObjArr = this._getDataObjArr(inputsArr);
    if (!dataObjArr) return;

    var formData = this._createFormData(dataObjArr);
    this._postFormData(formData, this._onReqEnd.bind(this));
};


FormValidator.prototype._getDataObjArr = function(inputsArr) {
    var dataObjArr = [];

    var valuesObj = this._getValues(inputsArr);

    if (valuesObj.validationFailed) return false;

    dataObjArr.push({
        name: 'data',
        value: valuesObj.dataString
    });

    if (valuesObj.email) {
        dataObjArr.push({
            name: 'senderAddress',
            value: valuesObj.email
        });
    } else {
        dataObjArr.push({
            name: 'senderAddress',
            value: 'default@mail.com'
        });
    }

    if (valuesObj.fileArr.length > 0) {
        for (var i = 0; i < valuesObj.fileArr.length; i++) {
            dataObjArr.push({
                name: 'file[]',
                value: valuesObj.fileArr[i]
            });
        }
    }

    return dataObjArr;
};

FormValidator.prototype._getValues = function(inputsArr) {
    var res = {
            dataString: '',
            fileArr: []
        },
        escape = document.createElement('textarea'),
        input,
        value;

    function escapeHTML(html) {
        escape.textContent = html;
        return escape.innerHTML;
    }

    for (var i = 0; i < inputsArr.length; i++) {
        input = inputsArr[i];
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
            value = input.value;

            res.dataString += '<p><strong>' + input.name +': </strong> '+ escapeHTML(value) + '</p>';
            if (input.matches('[type="email"]')) {
                res.email = value;
            }

        } else if (input.classList.contains('customselect')) {
            value = input.dataset.value;
            res.dataString += '<p><strong>' + input.getAttribute('name') + ': </strong> ' + escapeHTML(value) + '</p>';

        } else if (input.classList.contains('uploadbutton')) {
            value = '';
            var inputFile = input.querySelector('input[type="file"]');

            if (inputFile.files.length > 0) {
                value = 'files';
                for (var j = 0; j < inputFile.files.length; j++) {
                    res.fileArr.push(inputFile.files[j]);
                }
            }
        }

        if (!this._valideateField(input, value)) {
            res.validationFailed = true;
        }
    }

    return res;
};

FormValidator.prototype._createFormData = function(dataObjArr) {
    var formData = new FormData();

    for (var i = 0; i < dataObjArr.length; i++) {
        formData.append(dataObjArr[i].name, dataObjArr[i].value);
    }

    return formData;
};

FormValidator.prototype._postFormData = function(formData, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "php/send.php", true);

    xhr.addEventListener('readystatechange', function onReadyStateChange() {
        if (this.readyState != 4) return;

        xhr.removeEventListener('readystatechange', onReadyStateChange);
        callback(this);
    });
    /*xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        callback(this);
    };*/

    this._waitingForResponse = true;
    // console.log('Setting this._waitingForResponse to ' + this._waitingForResponse);

    this._cusomEvent.bind(this)('sentrequest');

    xhr.send(formData);
};

FormValidator.prototype._onReqEnd = function(xhr) {
    if (!this._sumitingForm) return;

    this._waitingForResponse = false;
    // console.log('Setting this._waitingForResponse to ' + this._waitingForResponse);

    try {
        var res = JSON.parse(xhr.responseText);
    } catch(e) {
        var res = false;
    }

    if (xhr.status === 200 && res.success) {
        this._resetFields();
        this._cusomEvent.bind(this)('gotresponse', {success: true});
    } else {
        this._cusomEvent.bind(this)('gotresponse', {success: false});
    }
};

FormValidator.prototype._cusomEvent = function(evenName, detail) {
    if (!this._sumitingForm) return;

    var widgetEvent = new CustomEvent(evenName, {
        bubbles: true,
        detail: detail
    });

    this._sumitingForm.dispatchEvent(widgetEvent);
};

FormValidator.prototype._valideateField = function(input, value) {

    /*function onFocus(e) {
        console.log('focus!');
        this.removeEventListener('focus', onFocus, true);
        this.classList.remove('error');
    }*/

    if (
        input.classList.contains('required') &&
        (value === '' ||
            (input.matches('[type="email"]') && !this._isValidEmailAddress(value))
        )
    ) {
        input.classList.add('error');

        this._addListener(input, 'focus', this._onFocus, true);
        // input.addEventListener('focus', onFocus, true);
        return false;
    }

    return true;
};

FormValidator.prototype._onFocus = function(e) {
    var currentTarget = e.currentTarget;
    this._removeListener(currentTarget, 'focus', this._onFocus, true);
    currentTarget.classList.remove('error');
};

FormValidator.prototype._isValidEmailAddress = function(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

FormValidator.prototype._resetFields = function() {
    var inputsArr = this._sumitingForm.querySelectorAll('[data-component="form-input"]');
    var input;

    for (var i = 0; i < inputsArr.length; i++) {
        input = inputsArr[i];

        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
            input.value = '';

        } else if (input.classList.contains('customselect')) {
            // input.dataset.value = '';
            // input.querySelector('.title').innerHTML = input.dataset.defaultValue;

            // input.classList.remove('option_selected');

            var select = this._findInstanceByElem(input, this._selectArr);
            if (select) {
                select.resetToDefault();
            }

        } else if (input.classList.contains('uploadbutton')) {
            // var inputFile = input.querySelector('input[type="file"]');
            // var inputLabel = input.querySelector('.input');

            // inputFile.value = '';
            // inputLabel.textContent = input.dataset.defaultValue;
            var upload = this._findInstanceByElem(input, this._uploadArr);
            if (upload) {
                upload.resetToDefault();
            }
        }
    }
};

FormValidator.prototype._findInstanceByElem = function(elem, instanceArr) {
    if (elem && instanceArr) {

        for (var i = 0; i < instanceArr.length; i++) {
            if (instanceArr[i].returnElem() === elem) {
                return instanceArr[i];
            }
        }

    }

    return false;
};

module.exports = FormValidator;