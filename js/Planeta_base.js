class Planeta_base{
    constructor(id, nombre, tamanio, masa, tipo) {
        this.id = id,
        this.nombre = nombre,
        this.tamanio = tamanio,
        this.masa = masa,
        this.tipo = tipo
    }

    verify() {
        return this.checkTitulo();
    }
    
      checkTitulo() {
        return { success: true, rta: null };
    }
}

export{Planeta_base}