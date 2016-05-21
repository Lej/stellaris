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
            
            if (token.type === Token.VARIABLE && /[^a-z0-9_]/i.test(token.value)) {
                throw new Error("Tokenizer failed on: " + token.value);
            }
        }
        
        return tokens;
    }
    
    getNextToken(text, start) {
        
        start = this.getNextNonWhitespace(text, start);
        let char = text.charAt(start);
        if (char === '@') {
            return this.getUntilWhitespaceToken(Token.MACRO, text, start);
        } else if (char === '=') {
            return this.getSingleCharToken(Token.ASSIGNMENT, text, start);
        } else if (/[\-0-9]/.test(char)) {
            return this.getNumberToken(text, start);
        } else if (char === '{') {
            return this.getSingleCharToken(Token.OPEN, text, start);
        } else if (char === '}') {
            return this.getSingleCharToken(Token.CLOSE, text, start);
        } else if (char === ">") {
            return this.getSingleCharToken(Token.GREATER, text, start);
        } else if (char === "<") {
            return this.getSingleCharToken(Token.LESS, text, start);
        } else if (char === '"') {
            return this.getStringToken(text, start);
        } else {
            return this.getUntilWhitespaceToken(Token.VARIABLE, text, start);
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
    
    getSingleCharToken(type, text, start) {
        return this.getTokenResult(type, text, start, start + 1);
    }
    
    getUntilWhitespaceToken(type, text, start) {
        let end = start;
        while(/\S/.test(text.charAt(end))) {
            end++;
        }
        return this.getTokenResult(type, text, start, end);
    }

    getNumberToken(text, start) {
        let end = start + 1;
        while (/[0-9\.]/.test(text.charAt(end))) {
            end++;
        }
        return this.getTokenResult(Token.NUMBER, text, start, end);
    }

    getStringToken(text, start) {
        let end = start + 1;
        while(text.charAt(end) !== '"') {
            end++;
        }
        return new TokenResult(start, end + 1, new Token(Token.STRING, text.substring(start + 1, end)));
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