import {Component} from '@angular/core';
import {DraggableDirective} from '../../../exports';

@Component({
  selector: 'hi-draggable-demo',
  templateUrl: './draggable-demo.template.html'
})
export class DraggableDemoComponent {
  source = new Array(10).fill(0).map((_, index) => index + 1);
  target = [];

  onDrop2Right($event) {
    const contextData = $event.dataTransfer.getData(DraggableDirective.DRAGGABLE_DATA_KEY);
    const data = JSON.parse(contextData);
    console.log('drag data to right', data);
    this.source = this.source.filter(item => item !== data.data);
    this.target = [...this.target, data.data];
  }
}
