import { Chat } from "./chat";
import { Usuario } from "./usuario";

export class ChatUsuario {

    /*************PK's*****+*****/
    chat : Chat = new Chat();
    usuario : Usuario = new Usuario();
    /****************************/

    scopeUser : string | undefined;
    fechaUnion : string | undefined;

}
