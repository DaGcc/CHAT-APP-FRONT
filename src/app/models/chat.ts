import { Mensaje } from "./mensaje";
import { TipoChat } from "./tipoChat";

export class Chat {
    idChat: any;
    nombre:  string | undefined;
    tipoChat : TipoChat | undefined;
    fechaCreacion: string | undefined;
    listaMensajes : Mensaje[] = []; 
}
