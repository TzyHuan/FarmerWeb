import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionService } from '../../../api/system_auth/action.service';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'system-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  providers: [ActionService],
})
export class ActionComponent implements OnInit {

  // 監聽Tab切換，初始值第一頁
  private emitTabChange = new BehaviorSubject<number>(0);
  private TabChangeEmitted$ = this.emitTabChange.asObservable();
  public tabLoadedData: any[] = [];

  @ViewChild('paginator') paginator: MatPaginator;

  /** 每更動DOM(按排序或下一頁都算)都會自動重新偵測，若該變數在非選擇的tab，得到 ms 則為 undefine
   * angular有bug，每切tab時 dataSource.sort自動歸零對應
  */
  // @ViewChild('ActionSort') set matActionSort(ms: MatSort) {
  //   this.TabChangeEmitted$.subscribe((index: number) => {
  //     if (ms && index == 0 && this.ActionDataSource) {
  //       this.ActionDataSource.sort = ms;
  //     }
  //   });
  // }
  // @ViewChild('CtrlSort') set matCtrlSort(ms: MatSort) {
  //   this.TabChangeEmitted$.subscribe((index: number) => {
  //     if (ms && index == 1 && this.CtrlDataSource) {
  //       this.CtrlDataSource.sort = ms;
  //     }
  //   });
  // }

  /** 個人覺得此法比較不好用，要等到切換tab後重新抓DOM才會執行 */
  // @ViewChild('ActionPaginator') set ActionPaginator(mp: MatPaginator) {
  //   if (mp) {
  //     console.log('ActionPaginator')
  //     //console.log(mp)
  //     //this.paginator.length = this.ActionDataSource.data.length;
  //     //this.setDataSourceAttributes(0));
  //   }
  // }
  // @ViewChild('CtrlPaginator') set CtrlPaginator(mp: MatPaginator) {
  //   if (mp) {
  //     console.log('CtrlPaginator')
  //     // console.log(mp)
  //     //this.paginator.length = this.CtrlDataSource.data.length;
  //     //this.setDataSourceAttributes(1);
  //   }
  // }

  constructor(private ActionREST: ActionService) { }

  ngOnInit() {
    // 初始讀第一個tab的資料
    this.loadData(0);
  }


  loadData(index: number) {
    switch (index) {
      case 0: {
        // statements;
        break;
      }
      case 1: {
        // statements;
        break;
      }
      default: {
        // statements;
        break;
      }
    }
  }

  /** 統一在parent頁面讀取tabs的資料暫存  // todo
   * 要是在tab的component讀，每切換就會重新讀取API浪費資源*/
  setDataSourceAttributes(index: number) {

    // if (!this.tabLoadedData[index]) {
    //   this.tabLoadedData[index] = new Date();
    // }
    // return this.tabLoadedData[index];

    // 切換tab時移至第一頁
    this.paginator.firstPage();
  }

}
