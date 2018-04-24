import 'reflect-metadata';//處理元數據，動態導入用
import 'zone.js';//抓瀏覽器異步事件

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(seccess=>console.log('Bootstrap success'))
  .catch(err => console.log(err));
