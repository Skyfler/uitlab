"use strict";

function CustomUploadButton(options) {
    this._elem = options.elem;

    this._visibleInput = this._elem.querySelector('.input');
    this._hiddenInput = this._elem.querySelector('input[type="file"]');

    this._defaultValue = this._visibleInput.textContent;
    this._hiddenInput.value = '';

    this._elem.addEventListener('change', this._onChange.bind(this));
}

CustomUploadButton.prototype._onChange = function(e) {
    var target = e.target;

    if (target !== this._hiddenInput) return;

    var fileName;

    if (this._hiddenInput.value === '') {
        // fileName = 'Attach file';
        fileName = this._defaultValue;
    } else {
        var valArr = this._hiddenInput.value.split('\\');
        fileName = valArr[valArr.length - 1];
    }
    this._visibleInput.innerHTML = fileName;
};

CustomUploadButton.prototype.resetToDefault = function() {
    this._hiddenInput.value = '';
    this._visibleInput.textContent = this._defaultValue;
};

CustomUploadButton.prototype.returnElem = function() {
    return this._elem;
};

module.exports = CustomUploadButton;