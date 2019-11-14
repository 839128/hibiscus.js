/**
 * Created by chenlei on 2018/3/28.
 */
// tslint:disable:no-any
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
      isLeaf: true
    }]
  }, {
    value: 'ningbo',
    label: 'Ningbo',
    isLeaf: true
  }]
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
      isLeaf: true
    }]
  }]
}];

const otherOptions = [{
  value: 'fujian',
  label: 'Fujian',
  children: [{
    value: 'xiamen',
    label: 'Xiamen',
    children: [{
      value: 'Kulangsu',
      label: 'Kulangsu',
      isLeaf: true
    }]
  }]
}, {
  value: 'guangxi',
  label: 'Guangxi',
  children: [{
    value: 'guilin',
    label: 'Guilin',
    children: [{
      value: 'Lijiang',
      label: 'Li Jiang River',
      isLeaf: true
    }]
  }]
}];

@Component({
  selector: 'cascader-basic',
  templateUrl: './cascader-demo.template.html',
  styles: [
      `
      .hi-cascader-picker {
        width: 300px;
      }

      .change-options {
        display: inline-block;
        font-size: 12px;
        margin-top: 8px;
      }
    `
  ]
})
export class CascaderDemoComponent implements OnInit {

  constructor(private http: HttpClient) {

  }

  public _formatData(snode) {
    let r = [], i, j;
    let tmpMap = [];
    let tmpArea = [];
    let key = 'areacode', parentKey = 'parentcode', childKey = 'children';
    // {areaname: "房山区", level: "3", parentcode: "110100", areaphone: "10", abbreviation: "房山"}
    for (i = 0; i < snode.length; i++) {
      let obj = {
        value: snode[i].areacode,
        label: snode[i].areaname,
        level: snode[i].level,
        parentcode: snode[i].parentcode,
        isLeaf: snode[i].level === 3 ? true : false
      };
      tmpMap[snode[i][key]] = obj;
      tmpArea.push(obj);
    }

    for (j = 0; j < tmpArea.length; j++) {
      if (tmpMap[tmpArea[j][parentKey]] && tmpArea[j][key] !== tmpArea[j][parentKey]) {
        if (!tmpMap[tmpArea[j][parentKey]][childKey]) {
          tmpMap[tmpArea[j][parentKey]][childKey] = [];
        }
        tmpMap[tmpArea[j][parentKey]][childKey].push(tmpArea[j]);
      } else {
        r.push(tmpArea[j]);
      }
    }
    return r;
  }

  /** init data */
  public options = null;

  /** ngModel value */
  public values: any[] = null;

  ngOnInit(): void {

    // let's set options in a asynchronous way
    setTimeout(() => {
      this.options = options;
    }, 100);

    this.http.request('GET',
      'http://www.baidu.com'
    ).subscribe((res) => {
      this.options = this._formatData(res.toString());
    });
  }

  public changeNzOptions(): void {
    if (this.options === options) {
      this.options = otherOptions;
    } else {
      this.options = options;
    }
  }

  public onChanges(values: any): void {
    console.log(values, this.values);
  }
}
