import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /***********temporal****************/

  emailInput: string = 'userOne@gmail.com';
  passInput : string = '123' 
  /*********************************+ */

  listaUsuarioPermitidos: Usuario[] = [
    {
      idUsuario: 1,
      nombre: 'one',
      estado: true,
      email: "userOne@gmail.com",
      password: "123",
      color: "#5800ff"
    },
    {
      idUsuario: 2,
      nombre: 'two',
      estado: true,
      email: "userTwo@gmail.com",
      password: "123",
      color: "#ff2"
    },
    {
      idUsuario: 3,
      nombre: 'three',
      estado: true,
      email: "userThree@gmail.com",
      password: "123",
      color: "#fe2"
    }

  ]


  constructor(private router :Router,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
  }

  login(){
    let estado : boolean = false;

    for(let u of this.listaUsuarioPermitidos){
      if(u.email===this.emailInput && u.password===this.passInput){
        sessionStorage.setItem(`${environment.USUARIO}`,JSON.stringify(u));
        estado = true;
        break;
      }
    }

    if(estado){

      this.snackBar.open('REDIRECCIONANDO...','AVISO',{
        duration:1000
      })
      setTimeout(()=>{
        this.router.navigate(['app'])
      },1000)
      
    }else{
      this.snackBar.open('CREDENCIALES INCORRECTAS O NO SE ENCUENTRA REGISTRADO...','AVISO',{
        duration:1000
      })
    }

  }
}
