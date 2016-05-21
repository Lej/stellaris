import {Mangler} from './mangler';
import {Token} from './token';

export class Tokenizer {
    
    static tokenize(text) {
        return new Tokenizer().tokenize(text, 0);
    }
    
    tokenize(text, current) {
        
        let tokens = [];
        
        while(current < text.length) {
            
            let {start, end, token} = this.getNextToken(text, current);
            tokens.push(token);
            current = end;
        }
        
        return tokens;
    }
    
    getNextToken(text, start) {
        
        start = this.getNextNonWhitespace(text, start);
        let char = text.charAt(start);
        if (char === '@') {
            return this.getMacroToken(text, start);
        } else if (char === '=') {
            return this.getAssignmentToken(text, start);
        } else if (/[0-9]/.test(char)) {
            return this.getNumberToken(text, start);
        } else if (char === '{') {
            return this.getOpenToken(text, start);
        } else if (char === '}') {
            return this.getCloseToken(text, start);
        } else if (char === ">") {
            return this.getGreaterToken(text, start);
        } else if (char === '"') {
            return this.getStringToken(text, start);
        } else {
            return this.getVariableToken(text, start);
        }
        
    }
    
    getNextNonWhitespace(text, start) {
        while (/\s/.test(text.charAt(start))) {
            start++;
        }
        return start;
    }
    
    getTokenResult(type, text, start, end) {
        return new TokenResult(start, end, new Token(type, text.substring(start, end)));
    }
    
    getMacroToken(text, start) {
        let end = start;
        while(/\S/.test(text.charAt(end))) {
            end++;
        }
        return this.getTokenResult(Token.MACRO, text, start, end);
    }
    
    getAssignmentToken(text, start) {
        return this.getTokenResult(Token.ASSIGNMENT, text, start, start + 1); 
    }
    
    getNumberToken(text, start) {
        let end = start;
        while (/[0-9\.]/.test(text.charAt(end))) {
            end++;
        }
        return this.getTokenResult(Token.NUMBER, text, start, end);
    }
    
    getOpenToken(text, start) {
        return this.getTokenResult(Token.OPEN, text, start, start + 1);
    }
    
    getCloseToken(text, start) {
        return this.getTokenResult(Token.CLOSE, text, start, start + 1);
    }
    
    getStringToken(text, start) {
        let end = start + 1;
        while(text.charAt(end) !== '"') {
            end++;
        }
        return new TokenResult(start, end + 1, new Token(Token.STRING, text.substring(start + 1, end)));
    }
    
    getVariableToken(text, start) {
        let end = start;
        while(/\S/.test(text.charAt(end))) {
            end++;
        }
        return this.getTokenResult(Token.VARIABLE, text, start, end);
    }
    
    getGreaterToken(text, start) {
        return this.getTokenResult(Token.GREATER, text, start, start + 1);
    }
    
}

export class TokenResult {
    start;
    end;
    token;
    
    constructor(start, end, token) {
        this.start = start;
        this.end = end;
        this.token = token;
    }
}