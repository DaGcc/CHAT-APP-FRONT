import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router, private snackBar: MatSnackBar,
    private authService: AuthService) { }

  ngOnInit(): void {
    
  }
  navegar() {
    // this.commonsService.progressCambio.next(true);
    this.snackBar.open('Redirigiendo a la pagina de inicio', 'AVISO', {
      duration: 1750,
    })
    setTimeout(() => {
      this.router.navigate(['app']);
    }, 1700)
  }
}
