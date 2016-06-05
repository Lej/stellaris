import {bindable} from 'aurelia-framework';

export class Tier {

  @bindable tier;

  attached() {
    this.layout();
  }

  layout() {
    if (this.container === undefined) {
      return;
    }

    this.container.style.width = this.tier.width + 'px';
    this.container.style.height = this.tier.height + 'px';
    this.container.style.top = this.tier.top + 'px';
    this.container.style.left = this.tier.left + 'px';
  }
}
