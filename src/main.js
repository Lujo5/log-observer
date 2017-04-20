var chokidar = require("chokidar");
var fs = require("fs");
var scheduler = require('node-schedule');
var config = require("../resources/config.json");
var FileObserver = require("./observers/file-observer");
var WebObserver = require("./observers/web-observer");

// FILE OBSERVERS INITIALIZATION
var fileObservers = {};

config.files.forEach(function (file) {
    var safePath = file.path.replace(new RegExp("\\\\", 'g'), "/");
    var stats = fs.statSync(safePath);
    fileObservers[safePath] = new FileObserver(file.patterns, file.notifiers, safePath, file.encoding, stats["size"]);
});

var watcher = chokidar.watch(
    Object.keys(fileObservers), {
        alwaysStat: true,
        awaitWriteFinish: {
            stabilityThreshold: 1000,
            pollInterval: 100
        }
    }
);

watcher.on('change', function (path, stats) {
    var safePath = path.replace(new RegExp("\\\\", 'g'), "/");
    var watchedFile = fileObservers[safePath];
    watchedFile.process(stats);
});


// WEB OBSERVERS INITIALIZATION
var webObservers = {};

config.web_pages.forEach(function (page) {
    var webObserver = new WebObserver(page.patterns, page.notifiers, page.url);
    webObserver.scheduledJob = scheduler.scheduleJob(page.cron, function () {
        webObserver.process();
    });
    webObservers[page.url] = webObserver;
});
