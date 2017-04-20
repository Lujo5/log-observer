function Pattern(name, description, pattern, showGroup, caseSensitive, changeOnly) {
    this.name = name;
    this.description = description;
    this.pattern = pattern;
    this.showGroup = showGroup;
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

    if (this.changeOnly && result != null && result.length > this.showGroup) {
        var match = result[this.showGroup];
        if (this.oldValue != null && this.oldValue == match) {
            result = null;
        }
        this.oldValue = match;
    }

    var value = null;
    if (result != null && result.length > this.showGroup) {
        value = result[this.showGroup];
    } else if (result != null && result.length > 0 && result.length <= this.showGroup) {
        value = result[0];
    } else {
        value = null;
    }

    return value;
};

module.exports = Pattern;