import {Mangler} from './mangler';

export class Preprocessor {
    
    static preprocess(text) {
        let normalizedText = text.replace("\r\n", "\n");
        let lines = [];
        let index = 0;
        let prevIndex = 0;
        while (index < normalizedText.length) {
            if (normalizedText.charAt(index) === "\n") {
                let line = normalizedText.substring(prevIndex, index).split("#")[0].trim();
                lines.push(line);
                prevIndex = index + 1; 
            }
            index++;
        }
        let processedText = Mangler.from(lines).aggregate('', (cur, next) => cur + " " + next); 
        return processedText;
    }

}