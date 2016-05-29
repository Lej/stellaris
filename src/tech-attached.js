import {noView} from 'aurelia-framework';

@noView
export class TechAttached {
    
    attached() {
        var techs = d3.select("body").selectAll("div.tech-view");         
    }
    
}