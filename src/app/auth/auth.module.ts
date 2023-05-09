import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRecordComponent } from './auth-record/auth-record.component';



@NgModule({
  declarations: [
    LoginComponent,
    AuthRecordComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AuthModule { }
