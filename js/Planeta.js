import {Planeta_base} from "./Planeta_base.js"

class Planeta extends Planeta_base{
    constructor(id, nombre, tamanio, masa, tipo, distancia, vida, anillo, compAtmosfera){
        super(id, nombre, tamanio, masa, tipo);
        this.distancia = distancia,
        this.vida = vida,
        this.anillo = anillo,
        this.compAtmosfera = compAtmosfera
    }
}

export {Planeta};