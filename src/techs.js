import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'd3';

import {Stellaris} from './logic/stellaris';

@inject(HttpClient, Stellaris)
export class Technologies {

  heading = 'Technologies';
  techs;
  tiers;

  constructor(http, stellaris) {
    this.http = http;
    this.stellaris = stellaris;
  }

  activate() {
    this.stellaris.getTechs()
      .then(techs => this.calculateLayout(techs))
      .then(techsAndTiers => this.draw(techsAndTiers))
      .then(techsAndTiers => {
        this.techs = techsAndTiers.techs;
        this.tiers = techsAndTiers.tiers;
      });
  }

  calculateLayout(techs) {
    let techWidth = 250;
    let techHeight = 50;
    let techHorizontalSpacing = 50;
    let techVerticalSpacing = 20;

    // Techs
    let areaGroups = techs
      .orderBy(x => x.id)
      .groupBy(x => x.area)
      .map((g, gi, gs) => ({ key: g.key, values: g.values.modify((v, vi) => {
        v.row = vi;
        for (let gii = 0; gii < gi; gii++) {
          v.row += gs[gii].values.length;
        }
      })}));

    for (let tech of techs) {
      tech.col = tech.tier;
      tech.width = techWidth;
      tech.height = techHeight;
      tech.left = tech.col * (tech.width + techHorizontalSpacing);
      tech.top = tech.row * (tech.height + techVerticalSpacing) + 100;
      tech.horizontalCenter = tech.left + tech.width / 2;
      tech.verticalCenter = tech.top + tech.height / 2;
      tech.right = tech.left + tech.width;
      tech.bottom = tech.top + tech.height;
    }

    // Tiers
    let maxTier = techs.max(tech => tech.tier);
    let bottom = techs.max(tech => tech.bottom);
    let tiers = [];
    for (let i = 0; i <= maxTier; i++) {
      let techsInTier = techs.filter(tech => tech.tier === i);
      let left = 0;
      if (i > 0) {
        left = tiers.single(tier => tier.number === i - 1).right;
      }
      let right = techsInTier.max(tech => tech.right) + techHorizontalSpacing / 2;
      let width = right - left;
      let height = bottom;
      let tier = {
        number: i,
        width: width,
        height: height,
        left: left,
        top: 0,
        right: right,
        bottom: bottom
      };
      tiers.push(tier);
    }

    return { techs: techs, tiers: tiers };
  }

  draw(techsAndTiers) {
    let techs = techsAndTiers.techs;
    let width = techs.max(tech => tech.right);
    let height = techs.max(tech => tech.bottom);

    let links = techs.selectMany(tech => tech.prereqs.map(prereq => ({ source: tech, target: prereq})));

    let svg = d3.select('.svg')
      .insert('svg', ':first-child')
      .attr('class', 'svg')
      .attr('width', width)
      .attr('height', height);

    let link = svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke-width', 1);

    link.attr('x1', function(tech) { return tech.source.horizontalCenter; })
      .attr('y1', function(tech) { return tech.source.verticalCenter; })
      .attr('x2', function(tech) { return tech.target.horizontalCenter; })
      .attr('y2', function(tech) { return tech.target.verticalCenter; });

    return techsAndTiers;
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
