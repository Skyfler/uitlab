"use strict";

function Polyfils() {

}

Polyfils.runAll = function() {
    Polyfils.polyfilForMatches();
    Polyfils.polyfilForClosest();
};

Polyfils.polyfilForMatches = function() {
    var e = Element.prototype;
    e.matches || (e.matches=e.matchesSelector||function(selector){
            var matches = document.querySelectorAll(selector), th = this;
            return Array.prototype.some.call(matches, function(e){
                return e === th;
            });
        });
};

Polyfils.polyfilForClosest = function() {
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

module.exports = Polyfils;