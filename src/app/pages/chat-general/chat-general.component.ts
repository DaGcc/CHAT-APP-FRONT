import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { Client, IFrame } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { MensajeG } from 'src/app/models-general/mensajeG';
import { UsuarioG } from 'src/app/models-general/usuarioG';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-general',
  templateUrl: './chat-general.component.html',
  styleUrls: ['./chat-general.component.scss']
})
export class ChatGeneralComponent implements OnInit, OnDestroy{


  RippleAnimationConfing: RippleAnimationConfig = { enterDuration: 600, exitDuration: 500 };


  //cliente STOMP -------------------------------------------
  cliente: Client = new Client();
  // sockJS: any = new SockJS('http://localhost:8080/chat-websocket');
  //---------------------------------------------------------


  //PARA ELEMENTOS DEL DOM ----------------------------------
  @ViewChild('scrollMe') private scrollConteiner!: ElementRef ; //tambien se puede usar Element

  contGroup: any
  //---------------------------------------------------------


  //VARIABLES------------------------------------------------
  usuario : Usuario = JSON.parse(sessionStorage.getItem(environment.USUARIO)!) as Usuario
  user: UsuarioG = new UsuarioG();

  mensaje: MensajeG = new MensajeG();
  mensajes: MensajeG[] = []

  notificacion : string| undefined
  //---------------------------------------------------------

  // elemento : any  

  scrollButton() {
  
    setTimeout(()=>{
      this.scrollConteiner!.nativeElement.scrollTop = this.scrollConteiner!.nativeElement.scrollHeight - this.scrollConteiner!.nativeElement.clientHeight;
    },100)

  }

  constructor() {
   }


  ngOnDestroy(): void {
    this.desconectar();
  }


  ngOnInit(): void {

    // this.elemento = document.getElementById('ciculo');
    
    this.contGroup = document.getElementById('listChat');
    
    this.user.nombre = this.usuario.username;
    this.user.color = this.usuario.color;
    this.user.email = this.usuario.email;
    this.user.idUsuario = this.usuario.idUsuario;
    this.user.estado = true;
    this.mensaje.username = this.user.nombre;
    this.mensaje.color = this.user.color

    this.conectar();
    this.logica();
    
    // this.elemento?.addEventListener('animationiteration', ()=>{
    //   var posicionTop = this.generarValorAleatorio(0, window.innerHeight - this.elemento.offsetHeight);
    //   var posicionLeft = this.generarValorAleatorio(0, window.innerWidth - this.elemento.offsetWidth);
    //   console.log(posicionLeft)
    //   console.log(posicionTop)
    //   this.elemento.style.setProperty('top', posicionTop+ 'px', 'important');

    //   this.elemento.style.setProperty('left', posicionLeft+ 'px', 'important');
  
    //   console.log(this.elemento)
    // });
    

  }

  conectar() {
    this.cliente.activate();
  }
  
  desconectar() {
    this.cliente.deactivate();
  }

  logica() {
    this.cliente.webSocketFactory = () => {
      let sockJs: any = new SockJS("http://localhost:8090/broker");
      return sockJs
    }
    this.cliente.onConnect = frame => {
      console.log(frame+ "on")


      this.mensaje.tipo = 'NUEVO_USUARIO'
      
      this.cliente.publish({
        destination: '/app/mensaje',
        body: JSON.stringify(this.mensaje)
      })

      this.cliente.subscribe('/chat/mensaje', e => {
        let mensaje: MensajeG = JSON.parse(e.body) as MensajeG;
        mensaje.fecha = new Date(mensaje.fecha!)
        console.log(mensaje)
        this.mensajes.push(mensaje)
        this.scrollButton();
      })



      this.cliente.subscribe('/chat/escribiendo', e => {
        this.notificacion = e.body
      })
    };



    this.cliente.onDisconnect = (frame) => {
      console.log(frame+ "of")
    }

  }



  escribiendo(texto : string ) { 
    let body = this.user.nombre;
    if(texto.trim()===''){
      body= "borra"
    }
    this.cliente.publish({
      destination: '/app/escribiendo',
      body: body
    })
  }


  enviarMensaje() {
    this.mensaje.tipo = 'MENSAJE'
    
    console.log(this.mensaje.texto)
    if(this.mensaje.texto?.trim()!="" && this.mensaje.texto!=undefined){
      this.cliente.publish({
        destination: '/app/mensaje',
        body: JSON.stringify(this.mensaje)
      })
      this.mensaje.texto=undefined
  
      this.cliente.publish({
        destination: '/app/escribiendo',
        body: "borra"
      })
    }
    
  }



  // generarValorAleatorio(min : number , max: number) {
  //   return Math.random() * (max - min) + min;
  // }
  

}
