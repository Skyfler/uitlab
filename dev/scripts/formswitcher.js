"use strict";

function FormSwitcher(options) {
    this._elem = options.elem;
    
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

module.exports = FormSwitcher;