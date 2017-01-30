var chokidar = require("chokidar");
var fs = require("fs");
var config = require("../resources/config.json");
var Observer = require("./observer");

var observers = {};

config.files.forEach(function (file) {
    var stats = fs.statSync(file.path);
    observers[file.path] = new Observer(file.path, file.encoding, file.patterns, file.notifiers, stats["size"]);
});

if (observers.length == 0) {
    console.error("Zero files configured");
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
    watchedFile.processChange(stats);
});