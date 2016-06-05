import {bindable} from 'aurelia-framework';

export class Tech {

  @bindable tech;

  /*techChanged(newValue) {
    this.layout();
  }*/

  attached() {
    this.layout();
  }

  layout() {
    if (this.container === undefined) {
      return;
    }

    this.container.style.width = this.tech.width + 'px';
    this.container.style.height = this.tech.height + 'px';
    this.container.style.top = this.tech.top + 'px';
    this.container.style.left = this.tech.left + 'px';
  }

  /*getTop(row) {
    let h = this.container.offsetHeight;
    let top = Math.round((h + 20) * row + 100);
    return top;
  }

  getLeft(col) {
    let w = this.container.offsetWidth;
    let left = Math.round((w + 100) * col);
    return left;
  }*/
}
