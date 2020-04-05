import { NgModule, ComponentFactoryResolver, Injectable } from '@angular/core';
import { Routes, RouterModule, Router, Route } from '@angular/router';

// ----Component----//
import { ClimateComponent } from './climate/climate.component';
import { HomeComponent } from './home/home.component';
// 登入&登出
import { UserComponents } from './user/user.module';
// 系統管理
import { SystemComponents } from './system/system.module';
// 地圖
import { MapComponents } from './map/map.module';
// 統計
import { StatisticsComponent } from './statistics/statistics.component';
// 直播
import { LiveComponent } from './live/live.component';

// ----ViewModel----//
import { VmMenu } from '../interface/system_auth/vm_menu';
import { SharedService } from './shared-service';

// routes會由上而下依照順序比對url路徑
// 若把path:'**'放第一位，就無法去其他Component
// 所以加入新的route要用unshift堆疊上去
// 初始化時先保留路徑''、'**'，讓空白的或亂打的url能進入統一進入HomeComponent
// 因為reset routes是事後API讀進去，這樣一開始沒抓到component會顯示空白
// todo: '**' should guard to the 404 not found page

// 這邊宣告所有要用的Components
export const AppRoutingComponents = [

  // Climate
  ClimateComponent,

  // Home
  HomeComponent,

  // User登入&登出
  UserComponents,

  // 統計
  StatisticsComponent,

  // 直播
  LiveComponent,
];

/**
 * lazy loading的module要先放在這讓Angular能先編譯成.js file，後續dynamic路徑再透過API修改才可以
 */
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }, {
    path: 'Map',
    loadChildren: './map/map.module#MapModule',
  }, {
    path: 'System',
    loadChildren: './system/system.module#SystemModule',
  }, {
    path: '**',
    component: HomeComponent,
  },
];

// const appRoutes: Routes = [
//   { path: 'home', component: HomeComponent },
//   {
//       path: 'signup', component: UserComponent,
//       children: [{ path: '', component: SignUpComponent }]
//   },
//   {
//       path: 'login', component: UserComponent,
//       children: [{ path: '', component: SignInComponent }]
//   },
//   { path : '', redirectTo:'/login', pathMatch : 'full'}
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // routes
  exports: [RouterModule],
})

@Injectable()
export class AppRoutingModule {

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private resolver: ComponentFactoryResolver,
  ) {
    this.sharedService.fullRoutesEmitted$.subscribe(
      (result: VmMenu[]) => {
        this.router.resetConfig(this.processRoute(result, resolver));
        console.log('rebuildRoutes success!!');
      }, (error) => {
        console.error(error);
      },
    );
  }

  public processRoute(receiveRoutes: VmMenu[],
    resolver: ComponentFactoryResolver = this.resolver) {
    const finalRoutes = [];

    // routes會由上而下依照順序比對url路徑
    // 宣告finalroutes後馬上加入url空白起頭
    finalRoutes.push({
      path: '',
      component: HomeComponent,
      pathMatch: 'full',
    });

    receiveRoutes.forEach((r) => {
      const tree: Route[] = this.treeMenu(r, resolver);

      // if tree is not undefined
      if (tree.length !== 0) {
        finalRoutes.push(tree[0]);
      }
    });

    // 最後才加入path:'**'路徑導入至Home，佇列在array最下面
    // 若把path:'**'放第一位，就無法去排在後面其他的Component
    // path '**' should direct to PageNotFoundComponent!
    finalRoutes.push({ path: '**', redirectTo: '' });
    return finalRoutes;
  }

  private treeMenu(root: VmMenu, resolver: ComponentFactoryResolver): Route[] {
    const factoryComponentType = SharedService
      .getComponentType(resolver, root);
    const returnTree = [];
    let treeRoot: Route;

    // if factory is not undefined
    if (factoryComponentType) {
      treeRoot = {
        path: root.path,
        component: factoryComponentType,
        children: [],
      };

      // if root have children
      if (root.children != null) {
        const childrenRoutes = [];
        const lazyRoute = routes.find(x => x.path.trim() === root.path.trim());

        if (lazyRoute) {
          treeRoot = {
            path: lazyRoute.path,
            loadChildren: lazyRoute.loadChildren,
          };
        } else {
          root.children.forEach((r, i) => {
            // 若有不只一個children，路徑path=''時自動轉跳至第一個child路徑
            // 因此第一筆foreach需加入path=''且redirectTo 第一個子componet之路徑
            if (i === 0) {
              childrenRoutes.push({
                path: '',
                redirectTo: r.path,
                pathMatch: 'full',
              });
            }

            const NodeChild: any = this.treeMenu(r, resolver);
            if (NodeChild.length !== 0) {
              childrenRoutes.push(NodeChild[0]);
            }
            treeRoot.children = childrenRoutes;
          });
        }
      }

      returnTree.push(treeRoot);
    }
    return returnTree;
  }
}
