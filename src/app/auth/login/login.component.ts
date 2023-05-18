import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /***********temporal****************/

  emailInput: string = 'userOne@gmail.com';
  passInput: string = '123'
  /*********************************+ */

  // listaUsuarioPermitidos: Usuario[] = [
  //   {
  //     idUsuario: 1,
  //     nombre: 'one',
  //     estado: true,
  //     email: "userOne@gmail.com",
  //     password: "123",
  //     color: "#5800ff"
  //   },
  //   {
  //     idUsuario: 2,
  //     nombre: 'two',
  //     estado: true,
  //     email: "userTwo@gmail.com",
  //     password: "123",
  //     color: "#ff2"
  //   },
  //   {
  //     idUsuario: 3,
  //     nombre: 'three',
  //     estado: true,
  //     email: "userThree@gmail.com",
  //     password: "123",
  //     color: "#fe2"
  //   }

  // ]

  formUser!: FormGroup;
  hide = true;

  email: FormControl = new FormControl(undefined, [Validators.email, Validators.required]);
  password: FormControl = new FormControl(undefined, Validators.required);


  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar, private authService: AuthService) {

  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['app'])
      this.snackBar.open('YA TE ENCUENTAS LOGEADO...',';)',{
        duration: 2000
      })
    }

    this.formUser = this.fb.group({
      email: this.email,
      password: this.password
    });

  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Tiene que ingresar un email';
    }
    return this.email.hasError('email') ? 'Email no valido' : '';
  }

  login() {
    this.authService.obtenerUsuarioPorEmail(this.formUser.value['email']).subscribe((data: Usuario) => {
      console.log(data)
      if (data.password != this.formUser.value.password) {
        this.snackBar.open('CREDENCIALES INCORRECTAS', 'AVISO', {
          duration: 2000
        })
      } else {
        sessionStorage.setItem(`${environment.USUARIO}`, JSON.stringify(data));
        this.snackBar.open('INICIANDO SESSION, POR FAVOR ESPERE UN MOMENTO...','AVISO',{
          duration: 1200
        });
        setTimeout(()=>{
          this.router.navigate(['app'])
        },1200);
      }
    });

    // for(let u of this.listaUsuarioPermitidos){
    //   if(u.email===this.emailInput && u.password===this.passInput){
    //     sessionStorage.setItem(`${environment.USUARIO}`,JSON.stringify(u));
    //     estado = true;
    //     break;
    //   }
    // }

    // if(estado){

    //   this.snackBar.open('REDIRECCIONANDO...','AVISO',{
    //     duration:1000
    //   })
    //   setTimeout(()=>{
    //     this.router.navigate(['app'])
    //   },1000)

    // }else{
    //   this.snackBar.open('CREDENCIALES INCORRECTAS O NO SE ENCUENTRA REGISTRADO...','AVISO',{
    //     duration:1000
    //   })
    // }

  }


}
