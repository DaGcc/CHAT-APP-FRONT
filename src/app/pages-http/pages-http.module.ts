import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { Unauthorized401Component } from './unauthorized401/unauthorized401.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    NotFoundComponent,
    Unauthorized401Component
  ],
  imports: [
    CommonModule, 
    MaterialModule
  ]
})
export class PagesHttpModule { }
