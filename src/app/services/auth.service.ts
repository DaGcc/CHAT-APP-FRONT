import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = `${environment.HOST}/usuarios` 
  constructor(private http : HttpClient) { }


  crearUsuaio(){

  }

  //temporal o no?
  obtenerUsuarioPorEmail(email:String):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.url}/buscado?email=${email}`)
  }

  isAuthenticated(){
    return sessionStorage.getItem(`${environment.USUARIO}`)? true : false;
  }

  logOut(){
    sessionStorage.removeItem(`${environment.USUARIO}`);
  }

  //recupera los datos del cliente que estan almacenados en el storage del navegador
  obtenerCredencialesUserstorage():Usuario{
    return JSON.parse(sessionStorage.getItem(`${environment.USUARIO}`)!) as Usuario;
  }

}
