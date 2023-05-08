import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthRecordComponent } from './auth/auth-record/auth-record.component';
import { ChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'chat',
    component:ChatComponent
  },
  {
    path:'auth-record',
    component:AuthRecordComponent
  },
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
