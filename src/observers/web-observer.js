var Observer = require("../observer");

function WebObserver(patterns, notifiers, url) {
    this.observer = new Observer(patterns, notifiers, url);
    this.pageUrl = url;
}

WebObserver.prototype.process = function () {
    //get page from url
    console.log("fetching data from url: " + this.pageUrl);

    this.observer.checkAndNotify("");
};

module.exports = WebObserver;