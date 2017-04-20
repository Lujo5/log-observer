function WebsocketNotifier(url) {
    this.urls = url;
}

// To be implemented
WebsocketNotifier.prototype.notify = function (report, patternName) {
    //console.log("Sending websocket notification: " + report);
};

module.exports = WebsocketNotifier;