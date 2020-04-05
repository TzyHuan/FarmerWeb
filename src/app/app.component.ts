import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDrawer, MatTreeNestedDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { VmMenu } from '../interface/system_auth/vm_menu';
import { SharedService, NavMenuService } from './shared-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})

export class AppComponent implements OnInit, OnDestroy {

  menuList: VmMenu[] = [];
  childRoutes$: Subscription;
  activeNode: any;
  treeControl = new NestedTreeControl<VmMenu>(node => node.children);
  dataSource = new MatTreeNestedDataSource<VmMenu>();
  @ViewChild('drawer') drawer: MatDrawer;

  hasChild = (_: number, node: VmMenu) => !!node.children && node.children.length > 0;

  constructor(
    private sharedService: SharedService,
    private navMenuService: NavMenuService,
  ) {
    // 只負責列出樹狀結構路徑在drawer中，路由跟導向由parent module實做
    // 因為lazy loading目前只能在child module才可以抓到entryComponents
    this.childRoutes$ = this.sharedService.childRoutesEmitted$
      .subscribe(([parentPath, childMenusList]: [string, VmMenu[]]) => {
        this.menuList = this.treeMenuPath(
          parentPath,
          JSON.parse(JSON.stringify(childMenusList)),
        );

        this.dataSource.data = this.menuList;
      });
  }

  ngOnInit() {
    this.navMenuService.setMenuDrawer(this.drawer);
  }

  ngOnDestroy() {
    this.navMenuService.clearMenuDrawer();
    this.childRoutes$.unsubscribe();
  }
  /** 點選router-outlet時，若此router-outlet還有子選，
   * 其子選單的[routerLink]一併在此call api查詢完，
   * 再利用sharedService傳給router-outlet
  */
  onRouterOutletActivate(event: Record<string, any>) {
    this.menuList = [];
    this.drawer.close();
    this.sharedService.emitChildRoutes(event);
  }

  /**
     * 疊代子路徑至父路徑的下層
     * eg. 路徑A底下有 a, b, c三個子路徑，修改後回傳子路徑 A/a, A/b, A/b
     * 之後可直將路徑套上至[routerLink]
     * @param parentPath 父路徑
     * @param childMenusList 子路徑清單
     */
  private treeMenuPath(parentPath: string, childMenusList: VmMenu[]): VmMenu[] {
    childMenusList.forEach(v => {
      v.path = `${parentPath}/${v.path}`;

      if (!v.children || v.children.length === 0) {
        return;
      } else {
        this.treeMenuPath(v.path, v.children);
      }
    });
    return childMenusList;
  }
}
