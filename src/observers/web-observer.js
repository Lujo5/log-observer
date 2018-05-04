var http = require('follow-redirects').http;
var https = require('follow-redirects').https;
var url = require("url");
var Observer = require("../observer");

function WebObserver(patterns, notifiers, urlString) {
    this.observer = new Observer(patterns, notifiers, urlString);
    this.parsedUrl = url.parse(urlString);
    this.scheduledJob = null;
}

WebObserver.prototype.process = function () {
    var options = {
        host: this.parsedUrl.hostname,
        port: this.parsedUrl.port,
        path: this.parsedUrl.path,
        method: 'GET',
        headers: {
            accept: '*/*'
        }
    };

    var req = null;
    if (this.parsedUrl.protocol.indexOf("https") > -1) {
        req = https.request(options, this._processResponse.bind(this));
    } else {
        req = http.request(options, this._processResponse.bind(this));
    }

    req.on("error", function (err) {
        console.log("Http request timeout: " + err.message);
    });

    req.end();
};

WebObserver.prototype.cancelScheduler = function () {
    this.scheduledJob.cancel();
};

WebObserver.prototype._processResponse = function (res) {
    var statusCode = res.statusCode;
    res.on('data', function (data) {
        if (statusCode === 200) {
            this.observer.checkAndNotify(data);
        } else {
            console.error("Web status code: " + statusCode + ", from: " + this.parsedUrl.href);
        }
    }.bind(this));
};

module.exports = WebObserver;