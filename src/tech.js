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

    this.container.style.top = this.getTop(this.tech.row) + 'px';
    this.container.style.left = this.getLeft(this.tech.col) + 'px';
  }

  getTop(row) {
    let h = this.container.offsetHeight;
    let top = Math.round((h + 20) * row + 100);
    return top;
  }

  getLeft(col) {
    let w = this.container.offsetWidth;
    let left = Math.round((w + 100) * col);
    return left;
  }
}
