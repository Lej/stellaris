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
    //return this.fetchAndParse('./static/common/technology/00_soc_tech_repeatable.txt');
    
    return this.fetchAndParse('./static/common/technology/00_eng_tech.txt')
      .then(_ => this.fetchAndParse('./static/common/technology/00_eng_tech_repeatable.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_eng_weapon_tech.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_phys_tech.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_phys_tech_repeatable.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_phys_weapon_tech.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_repeatable.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_soc_tech.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_soc_tech_repeatable.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_soc_weapon_tech.txt'))
      .then(_ => this.fetchAndParse('./static/common/technology/00_strategic_resources_tech.txt'));
      
  }
  
  fetchAndParse(path) {
    console.log("Fetching " + path);
    return this.http.fetch(path).then(response => response.text().then(text => this.parse(path, text)));
  }
  
  parse(path, text) {
    //console.log(text);
    console.log("Parsing " + path);
    let processedText = Preprocessor.preprocess(text);
    let tokens = Tokenizer.tokenize(processedText);
    let result = Parser.parse(tokens);
    //console.log(result);
    console.log("Parsed " + path);
  }
}
