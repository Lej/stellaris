import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

import {TechDto} from '../dto/tech-dto';
import {PegJs} from '../pegjs/pegjs';
import './array-ext';

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
    let paths = this.requireAll(require.context('../static/common/technology', false, /.txt$/));

    return Promise.all(paths.map(path => this.http.fetch(path)))
            .then(resps => Promise.all(resps.map(resp => resp.text().then(text => ({ url: resp.url, text: text })))))
            .then(datas => Promise.all(datas.map(data => this.parseTxt(data.url, data.text))))
            .then(scripts => this.loadTechsFromScripts(scripts));
  }

  parseTxt(url, text) {
    try {
      let parser = PegJs.getParser();
      let script = parser.parse(text);
      return Promise.resolve(script);
    } catch (e) {
      throw new Error('Failed to parse ' + url + ': ' + e.message);
    }
  }

  loadTechsFromScripts(scripts) {
    // tech id to dto map
    let map = scripts.selectMany(script => script)
            .filter(expr => expr.oper === '=')
            .filter(expr => expr.leftType === 'identifier')
            .reduce((prev, cur) => {
              let id = cur.left;
              prev[id] = { tech: new TechDto(id), expr: cur };
              return prev;
            }, {});

    let techs = [];

    for (let key in map) {
      // prereqs
      let prereqs = map[key].expr.right
        .filter(x => x.leftType === 'identifier')
        .filter(x => x.left === 'prerequisites')
        .filter(x => x.rightType === 'list')
        .selectMany(x => x.right)
        .map(x => map[x.value].tech);

      let area = map[key].expr.right
        .filter(x => x.leftType === 'identifier')
        .filter(x => x.left === 'area')
        .filter(x => x.rightType === 'identifier')
        .single()
        .right;

      let tier = map[key].expr.right
        .filter(x => x.leftType === 'identifier')
        .filter(x => x.left === 'tier')
        .filter(x => x.rightType === 'number')
        .single()
        .right;

      let rare = map[key].expr.right
        .filter(x => x.leftType === 'identifier')
        .filter(x => x.left === 'is_rare')
        .filter(x => x.rightType === 'identifier')
        .filter(x => x.right === 'yes')
        .any();

      let tech = map[key].tech;
      tech.prereqs = prereqs;
      tech.area = area;
      tech.tier = tier;
      tech.rare = rare;
      techs.push(tech);
    }

    return techs;

        //return [new TechDto("test1"), new TechDto("test2")]
  }

  requireAll(context) {
    return context.keys().map(context);
  }
}
