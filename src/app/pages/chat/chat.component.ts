import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  cliente : Client  = new Client();
  //develop
  constructor() {
    //feature chat
    /*
      codigo feature chat
    */
   }

  ngOnInit(): void {
  }

}
