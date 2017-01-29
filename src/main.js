var chokidar = require("chokidar");
var fs = require("fs");
var config = require("../resources/config.json");
var WatchedFile = require("./watched-file");

var files = {};

config.files.forEach(function (file) {
    var stats = fs.statSync(file.path);
    files[file.path] = new WatchedFile(file.path, file.encoding, file.patterns, file.notifiers, stats["size"]);
});

if (files.length == 0) {
    console.error("Zero files configured");
    process.exit(1);
}

var watcher = chokidar.watch(
    Object.keys(files), {
        alwaysStat: true,
        awaitWriteFinish: {
            stabilityThreshold: 1000,
            pollInterval: 100
        }
    }
);

watcher.on('change', function (path, stats) {
    var watchedFile = files[path];
    watchedFile.processChange(stats);
});