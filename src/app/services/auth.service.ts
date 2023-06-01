import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  usuarioCambio = new Subject<Usuario>();
  chatCambio = new Subject<void>();

  url: string = `${environment.HOST}/usuarios`
  constructor(private http: HttpClient) { }

  crearUsuaio(usuario: Usuario) {
    return this.http.post<Usuario>(`${this.url}/guardado`, usuario)
  }

  //temporal o no?
  obtenerUsuarioPorEmail(email: String): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/buscado?email=${email}`)
  }
  encontrarUsuarioPorEmilPorDniPorUsername(valor: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/buscar-usuario?valor=${valor}`)
  }

  isAuthenticated() {
    return sessionStorage.getItem(`${environment.USUARIO}`) ? true : false;
  }

  logOut() {
    sessionStorage.removeItem(`${environment.USUARIO}`);
  }

  //recupera los datos del cliente que estan almacenados en el storage del navegador
  obtenerCredencialesUserstorage(): Usuario {
    return JSON.parse(sessionStorage.getItem(`${environment.USUARIO}`)!) as Usuario;
  }

  actualizarCredencialesUserstorage(usuarioNuevo : Usuario){
    sessionStorage.removeItem(`${environment.USUARIO}`);
    sessionStorage.setItem(`${environment.USUARIO}`,JSON.stringify(usuarioNuevo));
    return (JSON.parse(sessionStorage.getItem(`${environment.USUARIO}`)!) as Usuario);
  }


  guardarConImg(usuario: Usuario, file : File): Observable<Usuario> {
    let form: FormData = new FormData();

    form.append("username", usuario.username!);
    form.append("archivo", file);
    form.append("genero", usuario.genero!);
    form.append("email", usuario.email!);
    form.append("dni", usuario.dni!);
    form.append("estado", String(usuario.estado));
    form.append("password", usuario.password!);

    return this.http.post<Usuario>(`${this.url}/con-img`, form)
  }

  editarConImg(usuario: Usuario, file : File): Observable<Usuario> {
    let form: FormData = new FormData();
    form.append("idUsuario", usuario.idUsuario!);
    form.append("username", usuario.username!);
    form.append("archivo", file);
    form.append("genero", usuario.genero!);
    form.append("email", usuario.email!);
    form.append("estado", String(usuario.estado));
    form.append("dni", usuario.dni!);
    form.append("password", usuario.password!);

    return this.http.put<Usuario>(`${this.url}/con-img`, form)
  }

  verImg(nomImg : string){
    return this.http.get<any>(`${this.url}/ver/${nomImg}`);
  }


}
