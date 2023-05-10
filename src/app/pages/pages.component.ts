import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  public screenWidth: any;
  public screenHeight: any;

  public estadoSide: boolean = true
 
  constructor() { }



  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  } 


  salvar(e : boolean){
    this.estadoSide = e
    console.log(e)
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    // console.log(this.screenWidth)
    // console.log(this.screenHeight)
  }

}
