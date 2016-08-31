"use strict";

function CustomSelect(options) {
    var elem = options.elem;
    var titleElem = elem.querySelector('.title');
    var defaultText = titleElem.innerHTML;
    var required = elem.classList.contains('required');

    elem.dataset.value = '';


    elem.onclick = function(event) {
        event.preventDefault();
        
        if (event.target === titleElem) {
            toggle();
        } else if (event.target.tagName == 'LI') {
            setValue(event.target.textContent, event.target.dataset.value);
            elem.classList.add('option_selected');
            close();
        }
    };

    var isOpen = false;

    // ------ обработчики ------

    // закрыть селект, если клик вне его
    function onDocumentClick(event) {
        if (!elem.contains(event.target)) close();
    }

    // ------------------------

    function setValue(title, value) {
        titleElem.innerHTML = title;
        elem.dataset.value = title;

        var widgetEvent = new CustomEvent('customselect', {
            bubbles: true,
            detail: {
                title: title,
                value: value
            }
        });

        elem.dispatchEvent(widgetEvent);

    }

    function toggle() {
        if (isOpen) close();
        else open();
    }

    function open() {
        elem.classList.add('open');
        document.addEventListener('click', onDocumentClick);
        isOpen = true;
    }

    function close() {
        elem.classList.remove('open');
        document.removeEventListener('click', onDocumentClick);
        isOpen = false;
    }

    function getOptionElems() {
        return elem.querySelectorAll('li');
    }

    this.setOption = function(optionIndex) {
        if (typeof optionIndex !== 'number') return;

        optionIndex = parseInt(optionIndex) + 1;

        var optionElemArr = getOptionElems();
        if (optionElemArr[optionIndex]) {
            var option = optionElemArr[optionIndex];

            setValue(option.textContent, option.dataset.value);
            elem.classList.add('option_selected');
        } else {
            this.resetToDefault();
        }

    };

    this.resetToDefault = function() {
        elem.classList.remove('option_selected');
        titleElem.innerHTML = defaultText;
    };

    this.returnElem = function() {
        return elem;
    };

    this.hideByDependency = function() {
        elem.style.display = 'none';
        elem.classList.remove('required');
        elem.classList.remove('error');
        this.resetToDefault();
    };

    this.revealByDependency = function() {
        elem.style.display = '';
        if (required) {
            elem.classList.add('required');
        }
    };

}
module.exports = CustomSelect;