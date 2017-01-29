var fs = require("fs");

function FileNotifier(path, encoding, separator) {
    var defaultEncoding = encoding || "utf-8";
    this.separator = separator || "\n";
    this.writer = fs.createWriteStream(path, {
        flags: 'a',
        defaultEncoding: defaultEncoding
    });
}

FileNotifier.prototype.sendNotification = function (report, patternName) {
    this.writer.write(patternName + ": " + report + this.separator);
};

module.exports = FileNotifier;