import { NgModule, ComponentFactoryResolver, Injectable } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

//----Component----//
import { ClimateComponent } from './climate/climate.component';
import { HomeComponent } from './home/home.component';
//登入&登出
import { UserComponents } from './user/user.module';
//系統管理
import { SystemComponents } from './system/system.module';
//地圖
import { MapComponents } from './map/map.module';
//統計
import { StatisticsComponent } from './statistics/statistics.component';
//直播
import { LiveComponent } from './live/live.component';


//----Service----//
import { SystemService } from '../api/system_auth/system.service';

//----ViewModel----//
import { VmMenu } from '../interface/system_auth/vm_menu';

//routes會由上而下依照順序比對url路徑
//若把path:'**'放第一位，就無法去其他Component
//所以加入新的route要用unshift堆疊上去
//初始化時先保留路徑''、'**'，讓空白的或亂打的url能進入統一進入HomeComponent
//因為reset routes是事後API讀進去，這樣一開始沒抓到component會顯示空白
//todo: '**' should guard to the 404 not found page
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
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
  imports: [RouterModule.forRoot(routes)], //routes
  exports: [RouterModule],
  providers: [SystemService],
})

@Injectable()
export class AppRoutingModule {
  public factories: any = [];

  constructor(
    private router: Router,
    private systemService: SystemService,
    private resolver: ComponentFactoryResolver,
  ) {
    // resolver可取到 ngModule 裡 bootstrap、entryComponents 裡定義的 Component type
    this.factories = Array.from(this.resolver['_factories'].values());

    this.systemService.getAllowedMenu().subscribe((result: VmMenu[]) => {
      this.router.resetConfig(this.processRoute(result));
    }, (error) => {
      console.error(error);
    });
  }

  processRoute(routes: VmMenu[]) {
    let finalRoutes = [];

    //routes會由上而下依照順序比對url路徑
    //宣告finalroutes後馬上加入url空白起頭
    finalRoutes.push({
      path: '',
      component: HomeComponent,
      pathMatch: 'full'
    });

    routes.forEach(r => {
      let tree: any = this.treeMenu(r);

      //is tree is not undefined
      if (tree.length != 0) {
        finalRoutes.push(tree[0]);
      }
    });

    //最後才加入path:'**'路徑導入至Home，佇列在array最下面    
    //若把path:'**'放第一位，就無法去排在後面其他的Component
    //path '**' should direct to PageNotFoundComponent!
    finalRoutes.push({ path: '**', redirectTo: '' });

    //console.log(finalRoutes);
    return finalRoutes;
  }

  private getComponentType(route: VmMenu): any {
    // 根據 componentType 名字取出對應的 componentType
    let factory: any = this.factories.find((x: any) => {
      return x.selector == route.selector;
    });
    return factory;
  }

  private treeMenu(root: VmMenu): any[] {

    var factory: any = this.getComponentType(root);
    var returnTree = [];
    var treeRoot: VmMenu;

    //if factory is not undefined
    if (factory) {
      treeRoot = {
        path: root.path,
        component: factory.componentType,
        children: [],
      }
      //if root have children
      if (root.children != null) {
        var first_iteration: boolean = true;
        let childrenRoutes = [];
        root.children.forEach(r => {

          //若有不只一個children，路徑path=''時自動轉跳至第一個child路徑
          //因此第一筆foreach需加入path=''且redirectTo 第一個子componet之路徑
          if (first_iteration) {
            childrenRoutes.push({
              path: '',
              redirectTo: r.path,
              pathMatch: 'full',
            });
            first_iteration = false;
          }

          let nodeChild: any = this.treeMenu(r);
          if (nodeChild.length != 0) {
            childrenRoutes.push(nodeChild[0]);
          }
          treeRoot.children = childrenRoutes;

        })
      }
      returnTree.push(treeRoot);
    }
    return returnTree;
  }
}

// 這邊宣告所有要用的Components
export const routingComponents = [

  //Climate
  ClimateComponent,

  //Home
  HomeComponent,

  //User登入&登出
  UserComponents,

  //系統管理
  SystemComponents,

  //地圖
  MapComponents,

  //統計
  StatisticsComponent,

  //直播
  LiveComponent,
]