var fs = require("fs");
var Observer = require("../observer");

function FileObserver(patterns, notifiers, path, encoding, size) {
    this.observer = new Observer(patterns, notifiers, path);
    this.path = path;
    this.encoding = encoding;
    this.lastSize = size;
    this.newSize = null;
}

FileObserver.prototype.process = function (stats) {
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

    readStream.on('data', function (data) {
        this.observer.checkAndNotify(data);
        this.lastSize = this.newSize;
    }.bind(this))
};

module.exports = FileObserver;