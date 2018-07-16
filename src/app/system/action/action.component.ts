import { Component, OnInit, ViewChild  } from '@angular/core';
import { ActionService } from './action.service';
import { Action, Ctrl } from './action';
import { BehaviorSubject  } from 'rxjs';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  providers: [ActionService]
})
export class ActionComponent implements OnInit {

  //監聽Tab切換，初始值第一頁
  private emitTabChange = new BehaviorSubject<number>(0);
  private TabChangeEmitted$ = this.emitTabChange.asObservable();

  @ViewChild('Paginator') paginator:MatPaginator;

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
  }
  
  setDataSourceAttributes(index: number) {
    this.emitTabChange.next(index);
    this.paginator.firstPage();
  }
}