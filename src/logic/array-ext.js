(function () {
    var apply = Function.prototype.apply;
    var flatten = apply.bind(Array.prototype.concat, []);

    Array.prototype.selectMany = function (fn) {
        return flatten(this.map(fn));
    };
    
    Array.prototype.single = function (fn) {
        var matches = this.filter(fn);
        if (matches.length > 1) {
            throw new Error("Single produced multiple matches.")
        }
        return matches[0];
    }
}());