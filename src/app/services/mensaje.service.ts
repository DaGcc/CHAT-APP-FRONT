import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  url: string = `${environment.HOST}/mensajes` ;
  
  constructor(private http : HttpClient) {
   }
  

                                                                 ///ver para Object
  listarChatPaginado(idChat: number,page : number, size: number) :Observable<any> {
    return this.http.get(`${this.url}/paginado?idChat=${idChat}&page=${page}&size=${size}&sort=idMensaje,asc`)
  }
 
}
