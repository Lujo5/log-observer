function StdoutNotifier(enabled) {
    this.enabled = enabled;
}

StdoutNotifier.prototype.sendNotification = function (report, patternName) {
    if(this.enabled) {
        console.log(patternName + ": " + report);
    }
};

module.exports = StdoutNotifier;