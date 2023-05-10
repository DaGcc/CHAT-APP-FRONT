import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRecordComponent } from './auth-record/auth-record.component';
import { NgParticlesModule } from "ng-particles";



@NgModule({
  declarations: [
    LoginComponent,
    AuthRecordComponent
  ],
  imports: [
    CommonModule,
    NgParticlesModule
  ]
})
export class AuthModule { }
