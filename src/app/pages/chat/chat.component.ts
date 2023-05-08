import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Client, IFrame } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  //cliente STOMP
  cliente: Client = new Client();
  sockJS: any = new SockJS('http://localhost:8080/chat-websocket');

  //PARA EL SCROLL
  @ViewChild('scroll') public scrollConteiner: ElementRef | undefined; //tambien se puede usar Element


  scrollButton() {
    //nativeElement que representa el elemento HTML actual.
    this.scrollConteiner!.nativeElement.scrollTop = this.scrollConteiner!.nativeElement.scrollHeight;
    /*CON INTERFAZ NATIVA DE TS/JS "Element"
    this.scrollConteiner!.scrollTop = this.scrollConteiner!.scrollHeight; 
    pero es menos seguro de inyectar
    */
    /*RAZON: 
La razón por la cual usar Element en lugar de ElementRef puede ser menos seguro es porque ElementRef es
una abstracción de Element que está diseñada específicamente para el uso en Angular.
Cuando se utiliza ElementRef, se obtiene una referencia segura al elemento HTML real del DOM y Angular se encarga de actualizar el elemento de manera adecuada
y segura dentro del ciclo de vida de Angular. Además, ElementRef también proporciona acceso a métodos útiles como nativeElement, que permite acceder a
la instancia real del elemento HTML.
Por otro lado, al utilizar directamente Element, se está trabajando con el objeto del DOM real y se pierde la capa adicional de seguridad y encapsulamiento 
que proporciona Angular. Esto puede llevar a problemas de seguridad si se modifica el DOM directamente o si no se maneja adecuadamente 
el ciclo de vida de Angular.
En resumen, utilizar ElementRef en lugar de Element es una buena práctica en Angular ya que proporciona una capa adicional de seguridad y
encapsulamiento para trabajar con el DOM de manera segura y efectiva.
    */
  }

  constructor() { }


  ngOnInit(): void {
  }

  conectar() {
    this.cliente.activate();
  }
  desconectar() {
    this.cliente.deactivate();
  }

  //LOGICA DESPUES DE CONECTARNOS CON EL EVENTO
  logica() {

    //RETORNA EL SOCKJS PARA NO USAR EL WEBSOCKET NATIVO DEL HTML
    this.cliente.webSocketFactory = () => {//SE EJECUTARA LUEGO DE ACTIVAR ENTRAR EN CONTACATO CON EL SERVIDOR
      return this.sockJS;
    }

  
    //METODO/ENVENTO QUE EJECUTARA LAS SUBSCRIPCIONES CUANDO NOS CONECTEMOS
    this.cliente.onConnect = (frame: IFrame) => { 
      console.log('Conectado a STOMP'); 
    };

  }

}
