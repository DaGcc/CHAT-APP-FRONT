import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatUsuario } from './../models/chatUsuario';
import { Chat } from '../models/chat';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  url: string = `${environment.HOST}/chats` 
  constructor(private http : HttpClient) { }


  listarChatDeUsuario(idUsuario : string):Observable<Chat[]>{
    return this.http.get<Chat[]>(`${this.url}/usuario/${idUsuario}`);
  }

  listarUsuariosDeChat(idChat : string):Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}/especial/${idChat}`);
  }
}
