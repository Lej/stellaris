import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Mangler} from './logic/mangler';
import {Preprocessor} from './logic/preprocessor';
import {Tokenizer} from './logic/tokenizer';
import {Parser} from './logic/parser';
import {Script} from './logic/script';

@inject(HttpClient)
export class Technologies {
  heading = 'Technologies';

  constructor(http) {
    this.http = http;
  }

  activate() {
    //let staticFile = require('file!./stellaris/common/technology/00_eng_tech.txt');
    let path = require('./static/common/technology/00_eng_tech.txt');
    console.log(path);
    
    return this.http.fetch(path)
        .then(response => response.text().then(text => this.parse(path, text)));
  }
  
  parse(path, text) {
    console.log(text);   
    let processedText = Preprocessor.preprocess(text);
    let tokens = Tokenizer.tokenize(processedText);
    let result = Parser.parse(tokens);
    console.log(result);
  }
  
  getMatches(text, regex) {
    let matches = [];
    let match;
    while (match = regex.exec(text)) {      
      matches.push(match);
    }
    return matches;
  }
}
