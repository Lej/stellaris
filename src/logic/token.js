export class Token {
    
    static UNKNOWN = "unknown";
    static MACRO = "macro";
    static VARIABLE = "variable";
    static OPEN = "opening brace"
    static CLOSE = "closing brace"
    static ASSIGNMENT = "assignment" 
    static NUMBER = "number"
    static STRING = "string"
    static GREATER = "greater than"
    
    type;
    value;
    
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    
}