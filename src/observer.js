var Pattern = require("./pattern");
var StdoutNotifier = require("./notifiers/stdout-notifier");
var FileNotifier = require("./notifiers/file-notifier");
var WebhookNotifier = require("./notifiers/webhook-notifier");
var EmailNotifier = require("./notifiers/email-notifier");
var WebsocketNotifier = require("./notifiers/websocket-notifier");

function Observer(patterns, notifiers, endpoint) {
    this.patterns = generatePatterns(patterns, endpoint);
    this.notifiers = generateNotifiers(notifiers, endpoint);
}

function generatePatterns(patterns, endpoint) {
    var patternsArray = [];

    for (var patternName in patterns) {
        if (patterns.hasOwnProperty(patternName)) {
            var pattern = patterns[patternName];
            var description = pattern["description"] || patternName;
            var patternString = pattern["pattern"];
            var caseSensitive = pattern["case_sensitive"] || false;
            var changeOnly = pattern["change_only"] || false;

            if (!patternString || !(typeof patternString == "string")) {
                console.error("Invalid or undefined pattern value for " + patternName + " event");
                process.exit(2);
            }

            var patternObject = new Pattern(patternName, description, patternString, caseSensitive, changeOnly);
            patternsArray.push(patternObject);
        }
    }

    if (patternsArray.length == 0) {
        console.error("Zero patterns defined for " + endpoint);
        process.exit(3);
    }

    return patternsArray;
}

function generateNotifiers(notifiers, endpoint) {
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
        console.error("Zero notifiers defined for " + endpoint);
        process.exit(5);
    }

    return notifiersArray;
}

Observer.prototype.checkAndNotify = function(data) {
    this.patterns.forEach(function (pattern) {
        var match = pattern.checkData(data);
        if (match != null && match.length > 0) {
            var report = match[0];
            this.notifiers.forEach(function (notifier) {
                notifier.notify(report, pattern.name);
            });
        }
    }.bind(this));
};

module.exports = Observer;