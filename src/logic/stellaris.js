import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

import {PegJs} from '../pegjs/pegjs';

@inject(HttpClient)
export class Stellaris {

    constructor(http) {
        this.http = http;
    }  

    init() {
        
        var paths = this.requireAll(require.context("../static/common/technology", true, /.txt$/));
        
        return this.getPaths(paths)
            .then(resps => this.getTexts(resps))
            .then(texts => this.parseAll(texts));
        
        
        //return this.http.fetch(path).then(response => response.text().then(text => this.parse(path, text)));
        //return this.http.fetch(path)
    }

    requireAll(context) {
        return context.keys().map(context);
    }

    getPaths(paths) {
        return Promise.all(paths.map(path => this.getPath(path)))
    }

    getPath(path) {
        return this.http.fetch(path).then(resp => ({ path: path, resp: resp }));
    }
    
    getTexts(resps) {
        return Promise.all(resps.map(resp => this.getText(resp)));
    }
    
    getText(resp) {
        return resp.resp.text().then(text => ({ path: resp.path, text: text}));
    }
    
    parseAll(texts) {
        return Promise.all(texts.map(text => this.parse(text.path, text.text)))
    }

    parse(path, text) {
        try {
            var parser = PegJs.getParser();
            var result = parser.parse(text);
        } catch(e) {
            throw new Error("Failed to parse " + path + ": " + e.message);
        }
        
    }

    getTechs() {
        
        
        
        
    }
    
    
}