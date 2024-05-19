import {Anuncio} from "./Anuncio.js"

class Anuncio_Auto extends Anuncio{
    constructor(id, titulo, transaccion, precio, descripcion, puertas, kms, potencia){
        super(id, titulo, transaccion, precio, descripcion);
        this.puertas = puertas,
        this.kms = kms,
        this.potencia = potencia
    }
}

export {Anuncio_Auto};