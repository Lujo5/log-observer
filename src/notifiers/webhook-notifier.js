var http = require("http");
var https = require("https");
var url = require("url");
var config = require("../../resources/config.json");

function WebhookNotifier(urls) {
    this.urls = urls;
}

function processResponse(res) {
    var code = res.statusCode;
    if (code != 200) {
        res.on('data', function (chunk) {
            console.error("Webhook status code: " + code + ", body: " + chunk);
        });
    }
}

function sendReport(destUrl, report) {
    var parsedUrl = url.parse(destUrl);

    var data = JSON.stringify({
        username: config.meta.name,
        text: report
    });

    var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var req = null;
    if (parsedUrl.protocol.indexOf("https") > -1) {
        req = https.request(options, processResponse);
    } else {
        req = http.request(options, processResponse);
    }

    req.write(data);
    req.end();
}

WebhookNotifier.prototype.sendNotification = function (report, patternName) {
    this.urls.forEach(function (destUrl) {
        sendReport(destUrl, patternName + ": " + report);
    });
};

module.exports = WebhookNotifier;