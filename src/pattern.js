function Pattern(name, description, pattern, caseSensitive) {
    this.name = name;
    this.description = description;
    this.pattern = pattern;
    this.caseSensitive = caseSensitive;
}

Pattern.prototype.checkData = function (data) {
    var patternRegEx = null;
    if (this.caseSensitive) {
        patternRegEx = new RegExp(this.pattern, 'g');
    } else {
        patternRegEx = new RegExp(this.pattern, 'gi');
    }

    return patternRegEx.exec(data);
};

module.exports = Pattern;