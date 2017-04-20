var chokidar = require("chokidar");
var fs = require("fs");
var config = require("../resources/config.json");
var FileObserver = require("./observers/file-observer");

var observers = {};

config.files.forEach(function (file) {
    var stats = fs.statSync(file.path);
    observers[file.path] = new FileObserver(file.patterns, file.notifiers, file.path, file.encoding, stats["size"]);
});

if (observers.length == 0) {
    console.error("Zero observers configured");
    process.exit(1);
}

var watcher = chokidar.watch(
    Object.keys(observers), {
        alwaysStat: true,
        awaitWriteFinish: {
            stabilityThreshold: 1000,
            pollInterval: 100
        }
    }
);

watcher.on('change', function (path, stats) {
    var watchedFile = observers[path];
    watchedFile.process(stats);
});