import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized401',
  templateUrl: './unauthorized401.component.html',
  styleUrls: ['./unauthorized401.component.scss']
})

export class Unauthorized401Component implements OnInit {


  constructor(private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    window.scroll(0,0);
  }

  navegar() {
    // this.commonsService.progressCambio.next(true);
    this.snackBar.open('Redirigiendo a la pagina de login', 'AVISO', {
      duration: 1750,
    })
    setTimeout(() => {
      this.router.navigate(['login'])
    }, 700)
  }
}
