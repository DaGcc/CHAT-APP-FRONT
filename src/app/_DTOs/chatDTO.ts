import { Chat } from "../models/chat";
import { ChatUsuario } from "../models/chatUsuario";

export class ChatDTO {

    chat : Chat = new Chat();
    listaChatUsuario : ChatUsuario[]  = [];

}
