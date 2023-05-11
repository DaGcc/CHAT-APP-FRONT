import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(){

  }

  logOut(){
    sessionStorage.removeItem(`${environment.USUARIO}`);
  }
}
