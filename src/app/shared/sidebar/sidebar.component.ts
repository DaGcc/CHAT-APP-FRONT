import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  public estadoSide: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(MatDrawer) drawer!: MatDrawer;


  user: Usuario = JSON.parse(sessionStorage.getItem(environment.USUARIO)!) as Usuario


  RippleAnimationConfing: RippleAnimationConfig = { enterDuration: 600, exitDuration: 500 };
  colorRiple: string = 'rgba(137, 137, 137,.1)'

  constructor(private utilService: UtilService, private router: Router, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.utilService.sideBarCambio.subscribe(() => {
      console.log('click')
      this.drawer.toggle();
      this.estadoSide.emit(this.drawer.opened)
    })

    // this.user = this.AuthService.obtenerCredencialesUserstorage();
  }

  selectedItem(e: any) {
    console.log(e);
    this.router.navigate([e.link]);
  }


  archivos: FileList | undefined

  seleccionarArchivo(e: any) {


    console.log(e)
    this.archivos = e.target.files

    console.log(this.archivos)
    if (this.archivos?.length === 0 || this.archivos == undefined) {
      
      this.snackBar.open("Proximamente eliminacion de foto...", ":v", {
        duration: 2000
      });
  

    } else {
      // this.user.estado = true;
      this.authService.editarConImg(this.user, this.archivos[0]).subscribe({
        next: (data: Usuario) => {
          console.log(data)
          this.snackBar.open("Cambiando de foto...", "Éxito", {
            duration: 2000
          });
          setTimeout(() => {
            this.snackBar.open("Listo....", ";)", {
              duration: 2000
            });
          }, 1000)
          this.user=this.authService.actualizarCredencialesUserstorage(data)
          this.authService.usuarioCambio.next(this.user)
        }
      })
    }

  }




  get src() {
    return `http://localhost:8080/usuarios/ver/${this.user.rutaFoto}`;
  }
}
