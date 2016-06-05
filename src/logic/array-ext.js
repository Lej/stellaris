(function() {
  let apply = Function.prototype.apply;
  let flatten = apply.bind(Array.prototype.concat, []);

  Array.prototype.selectMany = function(fn) {
    return flatten(this.map(fn));
  };

  Array.prototype.single = function(predicate) {
    if (predicate === undefined) {
      predicate = x => true;
    }
    let matches = this.filter(predicate);
    if (matches.length > 1) {
      throw new Error('Single produced multiple matches: ' + matches);
    }
    return matches[0];
  };

  Array.prototype.any = function(predicate) {
    return this.length > 0;
  };

  Array.prototype.groupBy = function(keySelector) {
    let map = {};

    for (let item of this) {
      let key = keySelector(item);
      if (map[key] === undefined) {
        map[key] = [];
      }
      map[key].push(item);
    }

    let groups = [];
    for (let key in map) {
      groups.push({ key: key, values: map[key] });
    }

    return groups;
  };

  Array.prototype.orderBy = function(keySelector) {
    let sorted = this.slice();
    sorted.sort((a, b) => {
      let aKey = keySelector(a);
      let bKey = keySelector(b);
      if (aKey > bKey) {
        return 1;
      }
      if (aKey < bKey) {
        return -1;
      }
      return 0;
    });
    return sorted;
  };

  Array.prototype.modify = function(action) {
    for (let i = 0; i < this.length; i++) {
      let item = this[i];
      action(item, i);
    }
    return this;
  };

  Array.prototype.min = function(selector) {
    if (selector === undefined) {
      selector = x => x;
    }
    return Math.min(...this.map(selector));
  };

  Array.prototype.max = function(selector) {
    if (selector === undefined) {
      selector = x => x;
    }
    return Math.max(...this.map(selector));
  };
}());
