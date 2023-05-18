import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { guardFn } from '../guards/guard-fn';


const routes: Routes = [

  {
    path: 'app',
    component:PagesComponent,
    children:[
      {
        path:'',
        component: HomeComponent
        
      },
      {
        path: 'chat',
        component:ChatComponent
      }
    ],canActivate:[guardFn]
  },

  // {
  //   path:'app',
  //   redirectTo:'app/home',
  //   pathMatch:'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}

