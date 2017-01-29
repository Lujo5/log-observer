function WebsocketNotifier(url) {
    this.urls = url;
}

WebsocketNotifier.prototype.sendNotification = function (report, patternName) {
    //console.log("Sending websocket notification: " + report);
};

module.exports = WebsocketNotifier;