"use strict";

var Helper = require('./helper');
var InnerPage = require('./ajaxPaginator-innerPage');

function AjaxPaginator(options) {
    Helper.call(this, options);

    this._innerPageClass = options.innerPageClass;
    this._mapInstance = options.mapInstance;
    this._innerPage = new InnerPage(document.querySelector('.' + this._innerPageClass), this._mapInstance);

    if (!history || !history.pushState) return;

    this._startLabel = options.startLabel;
    this._endLabel = options.endLabel;
    this._transitionDuration = options.transitionDuration;
    this._isTransitionning = false;

    this._init();

    window.addEventListener('popstate', this._onPopState.bind(this), false);
    document.addEventListener('click', this._onClick.bind(this));
}

AjaxPaginator.prototype = Object.create(Helper.prototype);
AjaxPaginator.prototype.constructor = AjaxPaginator;

AjaxPaginator.prototype._init = function() {
    var innerPageContent = this._findInnerPageContent(document.documentElement.innerHTML);
    if (!innerPageContent) {
        // console.log('Couldn`t add the first history entry.');
        return false;
    }

    // добавляем элемент истории
    // console.log('Adding first history state.');
    history.replaceState({innerPageInnerHTML: innerPageContent, url: '', title: document.title}, '');

    // console.log('DONE!');
    return true;
};

AjaxPaginator.prototype._onPopState = function(e) {
    if (history.state){

        this._innerPage.remove();

        // console.log('Retrieving visited page content.');
        var innerPageElem = document.querySelector('.' + this._innerPageClass);
        document.title = e.state.title;
        innerPageElem.innerHTML = e.state.innerPageInnerHTML;

        this._innerPage = new InnerPage(innerPageElem, this._mapInstance);
    }
};

AjaxPaginator.prototype._onClick = function(e) {
    if (e.which !== 1) return;

    var target = e.target;
    if (!target) {
        // console.log('No target!');
        return;
    }

    var link = this._findLink(target);
    if (!link) {
        // console.log('Target isn`t a link!');
        return;
    }

    var fullLink = this._getFullLink(link.getAttribute('href'));
    if (!this._testSameOrigin(fullLink)) {
        // console.log('External link.');
        return;
    }

    e.preventDefault();

    if (this._preventTransferCheck(link)) {
        // console.log('Prevented by "prevent-default-until".');
        return;
    }

    if (this._testSamePath(fullLink)) {
        // console.log('Link leads to the current page.');
        return;
    }

    if (this._isTransitionning) {
        // console.log('Page is changing right now!');
        return;
    }

    // console.log(link.getAttribute('href'));
    this._sendSignalToMainMenu();
    this._isTransitionning = true;
    this._getPage(link.getAttribute('href'), this._replaceInnerPageContent.bind(this), this._onError.bind(this));
};

AjaxPaginator.prototype._getFullLink = function(href) {
    var fullLink = document.createElement("a");
    fullLink.href = href;
    // IE doesn't populate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    if (fullLink.host == "") {
        fullLink.href = fullLink.href;
    }
    return fullLink;
};

AjaxPaginator.prototype._testSameOrigin = function(fullLink) {
    return location.hostname === fullLink.hostname;
};

AjaxPaginator.prototype._testSamePath = function(fullLink) {
    return location.pathname === fullLink.pathname;
};

AjaxPaginator.prototype._preventTransferCheck = function(link) {
    return link.hasAttribute('data-preventDefaultUntil') &&
        window.innerWidth < link.getAttribute('data-preventDefaultUntil');
};

AjaxPaginator.prototype._sendSignalToMainMenu = function() {
    var widgetEvent = new CustomEvent('signaltoclosemenu', {
        bubbles: true
    });

    document.dispatchEvent(widgetEvent);
};

AjaxPaginator.prototype._findLink = function(element) {
    if (element.hasAttribute('href')) {
        return element;
    } else if (element.parentElement) {
        return this._findLink(element.parentElement);
    }

    return null;
};

AjaxPaginator.prototype._getPage = function(url, success, error) {
    var xhr = new XMLHttpRequest();
    // var self = this;

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;

        if (this.status === 200) {
            // console.log('Inserting new page content.');
            if (success(this.responseText, url, true)) {

            } else {
                // alert('Problems with inserting new page!');
                // self._showErrorNotification();
                error();
            }

        } else {
            error();
        }

        this.onreadystatechange = null;
    };

    xhr.send();
};

AjaxPaginator.prototype._onError = function() {
    this._showErrorNotification();
    this._isTransitionning = false;
};

AjaxPaginator.prototype._replaceInnerPageContent = function(htmlPage, url, updateHistory) {
    var innerPageElem = document.querySelector('.' + this._innerPageClass);
    var newInnerPageContent = this._findInnerPageContent(htmlPage);
    if (!newInnerPageContent || !innerPageElem) return false;

    var newInnerPageElem = this._insertNewInnerPage(newInnerPageContent, innerPageElem);

    this._fadeInnerPage(innerPageElem, newInnerPageElem);

    if (updateHistory) {
        // добавляем элемент истории
        // console.log('Adding new history state.');
        var title = this._findTitle(htmlPage) || document.title;
        document.title = title;
        history.pushState({innerPageInnerHTML: newInnerPageContent, url: url, title: title}, '', url);
    }

    // console.log('DONE!');
    return true;
};

AjaxPaginator.prototype._findInnerPageContent = function(htmlPage) {
    var start = htmlPage.indexOf(this._startLabel);
    if (start === -1) {
        // console.log('Start not found!');
        return false;
    }
    var end = htmlPage.indexOf(this._endLabel, start);
    if (end === -1) {
        // console.log('End not found!');
        return false;
    } else {
        end += this._endLabel.length;
    }

    return htmlPage.substring(start, end);
};

AjaxPaginator.prototype._findTitle = function(htmlPage) {
    var startLabel = '<title>';
    var endLabel = '</title>';
    var start = htmlPage.indexOf(startLabel);
    if (start === -1) {
        // console.log('Start not found!');
        return false;
    }
    start += startLabel.length;

    var end = htmlPage.indexOf(endLabel, start);
    if (end === -1) {
        // console.log('End not found!');
        return false;
    }

    return htmlPage.substring(start, end);
};

AjaxPaginator.prototype._insertNewInnerPage = function(newInnerPageContent, innerPageElem) {
    var newInnerPageElem = document.createElement('div');
    newInnerPageElem.classList.add('new-main');
    newInnerPageElem.style.cssText = 'position: absolute; width: 100%; top: 0; left: 0; z-index: -1';

    newInnerPageElem.innerHTML = newInnerPageContent;
    innerPageElem.parentNode.insertBefore(newInnerPageElem, innerPageElem.nextSibling);

    return newInnerPageElem;
};

AjaxPaginator.prototype._fadeInnerPage = function(innerPageElem, newInnerPageElem) {
    innerPageElem.style.transitionProperty = "opacity";
    innerPageElem.style.transitionTimingFunction = "linear";
    innerPageElem.style.transitionDelay = 0 + 's';
    innerPageElem.style.transitionDuration = this._transitionDuration + 's';

    var newInnerPage = new InnerPage(newInnerPageElem, this._mapInstance);

    innerPageElem.addEventListener('transitionend', onTransitionEnd);

    var self = this;

    function onTransitionEnd(e) {
        var target = e.target;
        var prop = e.propertyName;

        if (target !== innerPageElem || prop !== 'opacity') return;

        target.removeEventListener('transitionend', onTransitionEnd);

        newInnerPageElem.style.cssText = '';
        newInnerPageElem.classList.remove('new-main');
        newInnerPageElem.classList.add(self._innerPageClass);

        self._innerPage.remove();
        innerPageElem.parentNode.removeChild(innerPageElem);
        innerPageElem.innerHTML = '';

        self._innerPage = newInnerPage;

        self._isTransitionning = false;
    }

    innerPageElem.style.opacity = 0;
};

module.exports = AjaxPaginator;