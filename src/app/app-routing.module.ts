import { NgModule, ComponentFactoryResolver, OnInit, Injectable } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http'
import { ClimateComponent } from './climate/climate.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';

import { MenuService } from './navmenu/navmenu.service';
import { vmMenu } from './navmenu/navmenu';

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
  providers: [MenuService]
})

@Injectable()
export class AppRoutingModule {
  public factories: any = [];  

  constructor(private MenuREST: MenuService, private router: Router, private resolver: ComponentFactoryResolver) {
    // resolver可取到 ngModule 裡 bootstrap、entryComponents 裡定義的 Component type
    this.factories = Array.from(this.resolver['_factories'].values());

    this.MenuREST.getAllowedMenu().subscribe(
      (result: vmMenu[]) => {
        this.router.resetConfig(this.processRoute(result, this.factories));
      },
      error => console.error(error)
    )
  }

  processRoute(routes: vmMenu[], factories: any) {
    let finalRoutes = [];

    //routes會由上而下依照順序比對url路徑
    //宣告finalroutes後馬上加入url空白起頭
    finalRoutes.push({
      path: '',
      component: HomeComponent,
      pathMatch: 'full'
    });

    routes.forEach(r => {
      // 根據 componentType 名字取出對應的 componentType      
      let factory: any = factories.find(
        (x: any) => {
          return x.componentType.name === r.component;
        }
      );

      //if factory is not undefined
      if (factory) {
        finalRoutes.push({
          path: r.path,
          component: factory.componentType
        });
      }
    })

    //最後才加入path:'**'路徑導入至Home，佇列在array最下面    
    //若把path:'**'放第一位，就無法去排在後面其他的Component
    finalRoutes.push({ path: '**', component: HomeComponent })

    return finalRoutes;
  }
}

// 這邊宣告所有要用的Components
export const routingComponents = [
  ClimateComponent,
  HomeComponent,
  SignInComponent,
  SignUpComponent,
]
