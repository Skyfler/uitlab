"use strict";

function Polyfills() {

}

Polyfills.runAll = function() {
    Polyfills.polyfillForMatches();
    Polyfills.polyfillForClosest();
    Polyfills.polyfillForCustomEvent();
};

Polyfills.polyfillForMatches = function() {
    var e = Element.prototype;
    e.matches || (e.matches=e.matchesSelector||function(selector){
            var matches = document.querySelectorAll(selector), th = this;
            return Array.prototype.some.call(matches, function(e){
                return e === th;
            });
        });
};

Polyfills.polyfillForClosest = function() {
    var e = Element.prototype;
    e.closest = e.closest || function(css){
            var node = this;

            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        }
};

Polyfills.polyfillForCustomEvent = function () {

    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
};

module.exports = Polyfills;