"use strict";

function Helper() {
    this._listenerArr = [];
    this._errorNotificationHTML = '<div class="error_notification">' +
        '<p>An Error Occurred!</p>' +
        '<p>Please Try Again Later.</p>' +
        '<button>ОК</button>' +
        '</div>';

    this._closeErrorNotification = this._closeErrorNotification.bind(this);
}

Helper.prototype._addListener = function(element, event, handler, phase) {
    if (!phase) {
        phase = false;
    }

    this._listenerArr.push({
        elem: element,
        event: event,
        handler: handler,
        phase: phase
    });
    var index = this._listenerArr.length - 1;

    this._listenerArr[index].elem.addEventListener(
        this._listenerArr[index].event,
        this._listenerArr[index].handler,
        this._listenerArr[index].phase
    );
};

Helper.prototype._removeListener = function(element, event, handler, phase) {
    if (!phase) {
        phase = false;
    }

    var index = this._returnListenerIndexInArr(element, event, handler, phase);

    if (index !== -1) {
        this._listenerArr[index].elem.removeEventListener(
            this._listenerArr[index].event,
            this._listenerArr[index].handler,
            this._listenerArr[index].phase
        );
        this._listenerArr.splice(index, 1);
    } else {
        // console.log('Listener was not found in array!');
        /*console.log(element);
        console.log(event);
        console.log(handler);*/
    }
};

Helper.prototype._returnListenerIndexInArr = function(element, event, handler, phase) {
    for (var i = this._listenerArr.length - 1; i >= 0; i--) {
        if (this._listenerArr[i].elem === element &&
            this._listenerArr[i].event === event &&
            this._listenerArr[i].handler === handler &&
            this._listenerArr[i].phase === phase) {
            return i;
        }
    }

    return -1;
};

Helper.prototype.remove = function() {
    //removing listeners
    for (var i = this._listenerArr.length - 1; i >= 0; i--) {
        this._removeListener(this._listenerArr[i].elem, this._listenerArr[i].event, this._listenerArr[i].handler);
    }

    //removing obj properties
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            delete this[key];
        }
    }
};

Helper.prototype._showErrorNotification = function() {
    this._cover = document.createElement('div');
    this._cover.style.cssText = 'z-index: 1000; position: fixed; height: 100%; width: 100%; top: 0; left: 0; background: rgba(255, 255, 255, 0.25)';
    this._cover.innerHTML = this._errorNotificationHTML;

    document.body.insertAdjacentElement('afterBegin', this._cover);
    document.body.style.overflow = 'hidden';
    this._addListener(document.body, 'click', this._closeErrorNotification);
};

Helper.prototype._closeErrorNotification = function(e) {
    var target = e.target;
    if (target.tagName !== 'BUTTON') return;

    document.body.removeChild(this._cover);
    delete this._cover;
    document.body.style.overflow = '';
    this._removeListener(document.body, 'click', this._closeErrorNotification);
};

Helper.prototype._sendCustomEvent = function(elem, eventName, options) {
    var widgetEvent = new CustomEvent(eventName, options);
    elem.dispatchEvent(widgetEvent);
};

module.exports = Helper;