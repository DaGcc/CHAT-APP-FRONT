import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { NotFoundComponent } from './pages-http/not-found/not-found.component';
import { Unauthorized401Component } from './pages-http/unauthorized401/unauthorized401.component';

const routes: Routes = [

  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:'unauthorized-401',
    component:Unauthorized401Component
  },
  {
    path:'**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthRoutingModule,PagesRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
