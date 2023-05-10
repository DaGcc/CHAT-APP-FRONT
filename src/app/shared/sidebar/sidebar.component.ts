import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  
  pixelResponsive: number = 900
  @Input()
  public getScreenWidth: any;

  @Input()
  public getScreenHeight: any;


  @Output()
  public estadoSide : EventEmitter<boolean> = new EventEmitter<boolean>();
  
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  RippleAnimationConfing: RippleAnimationConfig = { enterDuration: 600, exitDuration: 500 };
  colorRiple: string = 'rgba(137, 137, 137,.1)'

  constructor(private utilService: UtilService, private router: Router) { }

  ngOnInit(): void {
    this.utilService.sideBarCambio.subscribe(() => {
      console.log('click')
      this.drawer.toggle();
      this.estadoSide.emit(this.drawer.opened)
    })
  }

  selectedItem(e: any) {
    console.log(e);
    this.router.navigate([e.link]);
  }

}
