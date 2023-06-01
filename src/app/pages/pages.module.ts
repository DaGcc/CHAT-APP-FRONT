import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ChatComponent } from './chat/chat.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ChatEdicionDialogComponent } from './chat/chat-edicion-dialog/chat-edicion-dialog.component';
import { ChatGeneralComponent } from './chat-general/chat-general.component';



@NgModule({
  declarations: [
    PagesComponent,
    ChatComponent,
    HomeComponent,
    ChatEdicionDialogComponent,
    ChatGeneralComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule
  ]
})
export class PagesModule { }
