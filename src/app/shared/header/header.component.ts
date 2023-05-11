import { Component, Input, OnInit } from '@angular/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UtilService } from 'src/app/services/util.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  RippleAnimationConfing: RippleAnimationConfig = { enterDuration: 600, exitDuration: 500 };

  @Input()
  estadoSide: boolean = true; 


  constructor(private utilService: UtilService, private authService:AuthService, private router : Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
  }

  toogle(){
    this.utilService.sideBarCambio.next();
  }

  logOut(){
    this.snackBar.open('CERRANDO SESSION...!','AVISO',{
      duration: 1000
    })
    setTimeout(()=>{
      this.router.navigate(['/login'])
      this.authService.logOut();
    },1000)
    
  }

}
