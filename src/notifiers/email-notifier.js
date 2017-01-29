var nodemailer = require("nodemailer");
var config = require("../../resources/config.json");

function EmailNotifier(subject, from, to, conf) {
    this.subject = subject;
    this.from = from;
    this.to = to;
    this.transporter = nodemailer.createTransport(conf);
}

EmailNotifier.prototype.sendNotification = function (report, patternName) {
    var mailData = {
        from: this.from,
        to: this.to.join(", "),
        subject: this.subject.replace("{{name}}", config.meta.name).replace("{{event}}", patternName),
        text: patternName + ": " + report,
        html: "<html><body><p>" + report + "</p></body></html>"
    };

    this.transporter.sendMail(mailData, function (err, info) {
        if (err) {
            console.error("Sending e-mail failed, " + err);
            this.transporter.close();
        }
    }.bind(this));
};

module.exports = EmailNotifier;