import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

import {TechDto} from '../dto/tech-dto';
import {PegJs} from '../pegjs/pegjs';
import "./array-ext"

@inject(HttpClient)
export class Stellaris {

    constructor(http) {
        this.http = http;
    }  

    getTechs() {        
        //var locPath = require("../static/localisation/l_english.yml");
        return this.loadLocalization().then(_ => this.loadTechs()); 
    }

    loadLocalization() {
        
        return Promise.resolve(true);
    }
    
    loadTechs() {
        
        var paths = this.requireAll(require.context("../static/common/technology", false, /.txt$/));
        
        return Promise.all(paths.map(path => this.http.fetch(path)))
            .then(resps => Promise.all(resps.map(resp => resp.text().then(text => ({ url: resp.url, text: text })))))
            .then(datas => Promise.all(datas.map(data => this.parseTxt(data.url, data.text))))
            .then(scripts => this.loadTechsFromScripts(scripts));
            
    }
    
    parseTxt(url, text) {
        try {
            var parser = PegJs.getParser();
            var script = parser.parse(text);
            return Promise.resolve(script);
        } catch(e) {
            throw new Error("Failed to parse " + url + ": " + e.message);
        }
    }    

    loadTechsFromScripts(scripts) {
        
        var map = scripts.selectMany(script => script)
            .filter(expr => expr.oper === "=")
            .filter(expr => expr.leftType === "identifier")
            .reduce((prev, cur) => {
                var id = cur.left;
                prev[id] = { tech: new TechDto(id), expr: cur }
                return prev;
            }, {});
                
        var techs = [];
                
        for (var key in map) {
            var prereqs = map[key].expr.right
                .filter(x => x.leftType === "identifier")
                .filter(x => x.left === "prerequisites")
                .filter(x => x.rightType === "list")
                .selectMany(x => x.right)
                .map(x => map[x.value].tech);
                
            var tech = map[key].tech;
            tech.prereqs = prereqs;
            techs.push(tech);
        }
        
        return techs;
        
        //return [new TechDto("test1"), new TechDto("test2")]        
    }

    requireAll(context) {
        return context.keys().map(context);
    }
}