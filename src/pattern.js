function Pattern(name, description, pattern, caseSensitive, changeOnly) {
    this.name = name;
    this.description = description;
    this.pattern = pattern;
    this.caseSensitive = caseSensitive;
    this.changeOnly = changeOnly;
    this.oldValue = null;
}

Pattern.prototype.checkData = function (data) {
    var patternRegEx = null;
    if (this.caseSensitive) {
        patternRegEx = new RegExp(this.pattern, 'g');
    } else {
        patternRegEx = new RegExp(this.pattern, 'gi');
    }

    var result = patternRegEx.exec(data);

    if (this.changeOnly && result != null && result.length > 0) {
        var match = result[0];
        if (this.oldValue != null && this.oldValue == match) {
            result = null;
        }
        this.oldValue = match;
    }

    return result;
};

module.exports = Pattern;