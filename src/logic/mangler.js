export class Mangler {
    
    items;
    
    constructor(items) {
        this.items = items;
    }
    
    static from(items) {
        return new Mangler(items);
    }
    
    select(selector) {
        let newitems = [];
        for (let item of this.items) {
            newitems.push(selector(item));
        }
        return Mangler.from(newitems);
    }
    
    where(predicate) {
        let newitems = [];
        for (let item of this.items) {
            if (predicate(item)) {
                newitems.push(item);
            }
        }
        return Mangler.from(newitems);
    }
    
    aggregate(initialValue, aggregator) {
        let curValue = initialValue;
        for (let item of this.items) {
            curValue = aggregator(curValue, item);
        }
        return curValue;
    }
    
    toArray() {
        let newitems = [];
        for (let item of this.items) {
            newitems.push(item);
        }
        return newitems;
    }
    
    toMap(key, value) {
        let map = {};
        for (let item of this.items) {
            let key = key(item);
            let value = value(item);
            map[key] = value;
        }
        return map;
    }
    
    toMap() {
        let map = {};
        for (let item of this.items) {
            let key = item[0];
            if (map[key] !== undefined) {
                throw new Error("Duplicate key: " + key);
            }
            let value = item[1];
            map[key] = value;
        }
        return map;
    }
}