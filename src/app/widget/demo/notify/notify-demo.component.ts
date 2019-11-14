import {Component, ViewChild, TemplateRef, OnInit} from '@angular/core';
import {NotifyModel, NotifyService} from '../../../exports';

@Component({
  selector: 'hi-notify-demo',
  templateUrl: './notify-demo.template.html'
})
export class NotifyDemoComponent implements OnInit {

  @ViewChild('notifyTemplate', {static: false}) notifyTemplate: TemplateRef<any>;
  notifyIndex = 0;
  notifies: NotifyModel[] = [
    {
      type: 'success',
      html: 'Save order success!'
    },
    {
      type: 'danger',
      html: 'Get error: babababababa!'
    }
  ];

  constructor(private alertBoxService: NotifyService) {
  }

  ngOnInit(): void {
    this.notifies[1].template = this.notifyTemplate;
  }


  placementChange(placement) {
    this.alertBoxService.placement(placement);
  }

  showAlertMessage() {
    const index = this.notifyIndex++ % 2;
    this.alertBoxService.open({...this.notifies[index]}, index === 1 ? 2 * 1000 : 0);
  }
}
