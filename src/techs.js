import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'd3';

import {Stellaris} from './logic/stellaris';

@inject(HttpClient, Stellaris)
export class Technologies {

  heading = 'Technologies';

  constructor(http, stellaris) {
    this.http = http;
    this.stellaris = stellaris;
  }

  activate() {
    this.stellaris.getTechs()
      .then(techs => this.calculateLayout(techs))
      .then(techs => this.techs = techs);
  }

  calculateLayout(techs) {
    for (let tech of techs) {
      tech.col = tech.tier;
    }

    let areaGroups = techs
      .orderBy(x => x.id)
      .groupBy(x => x.area)
      .map((g, gi, gs) => ({ key: g.key, values: g.values.modify((v, vi) => {
        v.row = vi;
        for (let gii = 0; gii < gi; gii++) {
          v.row += gs[gii].values.length;
        }
      })}));

    return techs;
  }

  depth(tech) {
    if (tech.prereqs.length === 0) {
      tech.depth = 0;
      return tech.depth;
    }
    tech.depth = 1 + Math.max(...tech.prereqs.map(prereq => this.depth(prereq)));
    return tech.depth;
  }
}

  /*
  layout(techs) {

    var nodes = techs;
    var links = nodes.selectMany(tech => tech.prereqs.map(prereq => ({ source: tech, target: prereq})));

    nodes.forEach(node => this.depth(node));   

    var w = 3000;// = window.innerWidth;
    var h = 3000;// = window.innerHeight;
    console.log([w, h]);

    nodes.forEach(node => {
      node.x = Math.min(200 * node.depth, w);
      node.y = 1000;
    });

    console.log(nodes.map(node => this.depth(node)));

    var svg = d3.select("body")
      .insert("svg",":first-child")
      .attr("class", "svg")
      .attr("width", w)
      .attr("height", h);

    var link = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke-width", 1);

    //var n = nodes.length;
    //nodes.forEach(function(d, i) {
    //  d.x = d.y = w / n * i;
    //});


    var force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([w, h])
      .linkStrength(1) // 0.1
      .friction(0.9) // 0.9
      .linkDistance(300) // 20
      .charge(-100) // -30
      .chargeDistance(1000)
      .gravity(0.01)
      .theta(0.8)
      .alpha(0.1);

    let tick = () => {

      nodes.forEach(node => {
        node.x = Math.max(0 ,Math.min(w, node.x));
        node.y = Math.max(0 ,Math.min(h, node.y));
      })

      //this.techs = nodes;

      //node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
      //  .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

      //link.attr("x1", function(d) { return d.source.x; })
      //  .attr("y1", function(d) { return d.source.y; })
      //  .attr("x2", function(d) { return d.target.x; })
      //  .attr("y2", function(d) { return d.target.y; });
    }

    force.on("tick", tick).start();
    for (var i = 0; i < nodes.length; i++) {
      force.tick()
    };
    force.stop();



    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    return Promise.resolve(nodes);
  }*/
