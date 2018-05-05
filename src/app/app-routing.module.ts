import { NgModule, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { ClimateComponent } from './climate/climate.component';
import { HomeComponent } from './home/home.component';

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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [MenuService]
})

export class AppRoutingModule {
  public factories: any = [];
  public MenuList: vmMenu[];

  constructor(private MenuREST: MenuService, private router: Router, private resolver: ComponentFactoryResolver) {
    // resolver可取到 ngModule 裡 bootstrap、entryComponents 裡定義的 Component type
    this.factories = Array.from(this.resolver['_factories'].values());
  
    this.MenuREST.getAllowedMenu(1).subscribe(
      (result: vmMenu[]) => {
        this.router.resetConfig(this.processRoute(result));
      },
      error => console.error(error)
    )
  }

  processRoute(routes: vmMenu[]) {
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
      let factory: any = this.factories.find(
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
  HomeComponent
]
