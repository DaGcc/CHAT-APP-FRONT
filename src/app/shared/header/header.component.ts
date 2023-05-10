import { Component, Input, OnInit } from '@angular/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UtilService } from 'src/app/services/util.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  RippleAnimationConfing: RippleAnimationConfig = { enterDuration: 600, exitDuration: 500 };

  @Input()
  estadoSide: boolean = true; 


  constructor(private utilService: UtilService) { }

  ngOnInit(): void {
    
  }

  toogle(){
    this.utilService.sideBarCambio.next();
  }

}
