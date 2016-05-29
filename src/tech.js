import {bindable} from 'aurelia-framework';

export class Tech {
   
    @bindable tech;
    
    techChanged(newValue) {
        this.layout();
    }
    
    attached() {
        this.layout();
    }
    
    layout() {
        if (this.container === undefined) {
            return;
        }
        var div = this.container;
        //this.container.style.position = "absolute";
        this.container.style.left = Math.round(this.tech.x - this.container.offsetWidth / 2) + 'px';
        this.container.style.top = Math.round(this.tech.y - this.container.offsetHeight / 2) + 'px';
        if (this.tech.id === "tech_mass_drivers_1") {
            var asd = "";
        }
    }

}