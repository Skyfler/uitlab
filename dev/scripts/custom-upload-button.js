"use strict";

function CustomUploadButton(options) {
    this._elem = options.elem;

    this._visibleInput = this._elem.querySelector('.input');
    this._hiddenInput = this._elem.querySelector('.hidden-input');

    this._elem.addEventListener('change', this._onChange.bind(this));
}

CustomUploadButton.prototype._onChange = function(e) {
    var target = e.target;

    if (target !== this._hiddenInput) return;

    this._visibleInput.innerHTML = this._hiddenInput.value;
};

module.exports = CustomUploadButton;