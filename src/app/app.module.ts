import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/****************************MODULOS*************************/
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServerErrorInterceptor } from './interceptor/server-error.interceptor';
import { PagesHttpModule } from './pages-http/pages-http.module';

/************************COMPONENTES*************************/



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    PagesHttpModule,
    AuthModule,
    HttpClientModule
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:ServerErrorInterceptor,//estte es la clase que he creado en _shared
      multi:true,//esto para aceptar multiples peticiones
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
