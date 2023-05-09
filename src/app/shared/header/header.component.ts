import { Component, OnInit } from '@angular/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  RippleAnimationConfing: RippleAnimationConfig = { enterDuration: 600, exitDuration: 500 };

  constructor(private utilService: UtilService) { }

  ngOnInit(): void {
  }

  toogle(){
    this.utilService.sideBarCambio.next();
  }

}
