var fs = require("fs");
var Pattern = require("./pattern");
var StdoutNotifier = require("./notifiers/stdout-notifier");
var FileNotifier = require("./notifiers/file-notifier");
var WebhookNotifier = require("./notifiers/webhook-notifier");
var EmailNotifier = require("./notifiers/email-notifier");
var WebsocketNotifier = require("./notifiers/websocket-notifier");

function WatchedFile(path, encoding, patterns, notifiers, size) {
    this.path = path;
    this.encoding = encoding;
    this.patterns = generatePatterns(patterns, path);
    this.notifiers = generateNotifiers(notifiers, path);
    this.lastSize = size;
    this.newSize = null;
}

function generatePatterns(patterns, path) {
    var patternsArray = [];
    for (var patternName in patterns) {
        if (patterns.hasOwnProperty(patternName)) {
            var pattern = patterns[patternName];
            var description = pattern["description"] || patternName;
            var patternString = pattern["pattern"];
            var caseSensitive = pattern["case_sensitive"] || false;

            if (!patternString || !(typeof patternString == "string")) {
                console.error("Invalid or undefined pattern value for " + patternName + " event");
                process.exit(2);
            }

            var patternObject = new Pattern(patternName, description, patternString, caseSensitive);
            patternsArray.push(patternObject);
        }
    }

    if (patternsArray.length == 0) {
        console.error("Zero patterns defined for file " + path);
        process.exit(3);
    }

    return patternsArray;
}

function generateNotifiers(notifiers, path) {
    var notifiersArray = [];
    for (var notifierName in notifiers) {
        if (notifiers.hasOwnProperty(notifierName)) {
            var notifier = notifiers[notifierName];
            var notificationObject = null;
            switch (notifierName) {
                case "stdout":
                    notificationObject = new StdoutNotifier(notifier);
                    break;
                case "file":
                    notificationObject = new FileNotifier(notifier["path"], notifier["encoding"], notifier["separator"]);
                    break;
                case "webhook":
                    notificationObject = new WebhookNotifier(notifier["urls"]);
                    break;
                case "email":
                    notificationObject = new EmailNotifier(notifier["subject"], notifier["from"], notifier["to"], notifier["conf"]);
                    break;
                case "websocket":
                    notificationObject = new WebsocketNotifier(notifier["url"]);
                    break;
                default:
                    console.error("Invalid notifier type provided " + notifierName);
                    process.exit(4);
            }
            notifiersArray.push(notificationObject);
        }
    }

    if (notifiersArray.length == 0) {
        console.error("Zero notifiers defined for file " + path);
        process.exit(5);
    }

    return notifiersArray;
}

WatchedFile.prototype.processChange = function (stats) {
    this.newSize = stats.size;
    if (this.lastSize > this.newSize) {
        this.lastSize = this.newSize;
        return;
    }
    var readStream = fs.createReadStream(this.path, {
            start: this.lastSize,
            end: this.newSize,
            bufferSize: this.newSize - this.lastSize,
            encoding: this.encoding
        }
    );
    readStream.on('data', function (chunk) {
        this.patterns.forEach(function (pattern) {
            var match = pattern.processChunk(chunk);
            if (match != null && match.length > 0) {
                var report = match[0];
                this.notifiers.forEach(function (notifier) {
                    notifier.sendNotification(report, pattern.name);
                });
            }
        }.bind(this));
        this.lastSize = this.newSize;
    }.bind(this))
};

module.exports = WatchedFile;