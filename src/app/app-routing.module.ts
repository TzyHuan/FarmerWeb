import { NgModule, ComponentFactoryResolver, OnInit, Injectable, RenderComponentType } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http'

//----Component----//
import { ClimateComponent } from './climate/climate.component';
import { HomeComponent } from './home/home.component';
//登入&登出
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
//系統管理
import { SystemComponent } from './system/system.component';
import { MenuComponent } from './system/menu/menu.component';
import { ActionComponent } from './system/action/action.component';
import { CharacterComponent } from './system/character/character.component';

//----Service----//
import { NavMenuService } from './navmenu/navmenu.service';

//----ViewModel----//
import { vmNavMenu } from './navmenu/navmenu';

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
    component: HomeComponent
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
  providers: [NavMenuService]
})

@Injectable()
export class AppRoutingModule {
  public factories: any = [];

  constructor(private MenuREST: NavMenuService, private router: Router, private resolver: ComponentFactoryResolver) {
    // resolver可取到 ngModule 裡 bootstrap、entryComponents 裡定義的 Component type
    this.factories = Array.from(this.resolver['_factories'].values());

    this.MenuREST.getAllowedMenu().subscribe(
      (result: vmNavMenu[]) => {
        this.router.resetConfig(this.processRoute(result));
      },
      error => console.error(error)
    )
  }

  processRoute(routes: vmNavMenu[]) {
    let finalRoutes = [];

    //routes會由上而下依照順序比對url路徑
    //宣告finalroutes後馬上加入url空白起頭
    finalRoutes.push({
      path: '',
      component: HomeComponent,
      pathMatch: 'full'
    });

    routes.forEach(r => {
      let Tree: any = this.TreeMenu(r);

      //is tree is not undefined
      if (Tree.length != 0) {
        finalRoutes.push(Tree[0]);
      }
    });

    //最後才加入path:'**'路徑導入至Home，佇列在array最下面    
    //若把path:'**'放第一位，就無法去排在後面其他的Component
    //path '**' should direct to PageNotFoundComponent!
    finalRoutes.push({ path: '**', component: HomeComponent });

    return finalRoutes;
  }


  private GetComponentType(route: vmNavMenu): any {
    // 根據 componentType 名字取出對應的 componentType
    let factory: any = this.factories.find(
      (x: any) => {
        return x.componentType.name == route.component;
      }
    );
    return factory;
  }

  private TreeMenu(root: vmNavMenu): any[] {

    var factory: any = this.GetComponentType(root);
    var ReturnTree = [];
    var TreeRoot: vmNavMenu;

    //if factory is not undefined
    if (factory) {
      TreeRoot = {
        path: root.path,
        component: factory.componentType
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
              pathMatch: 'full'
            })
            first_iteration = false;
          }

          let NodeChild: any = this.TreeMenu(r);
          if (NodeChild.length != 0) {
            childrenRoutes.push(NodeChild[0]);
          }
          TreeRoot.children = childrenRoutes;

        })
      }
      ReturnTree.push(TreeRoot);
    }
    return ReturnTree;
  }
}

// 這邊宣告所有要用的Components
export const routingComponents = [
  ClimateComponent,
  HomeComponent,

  //登入&登出
  SignInComponent,
  SignUpComponent,

  //系統管理
  SystemComponent,
  MenuComponent,
  ActionComponent,
  CharacterComponent
]
