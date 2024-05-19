class Anuncio{
    constructor(id, titulo, transaccion, precio, descripcion) {
        this.id = id,
        this.titulo = titulo,
        this.transaccion = transaccion,
        this.precio = precio,
        this.descripcion = descripcion
    }

    verify() {
        return this.checkTitulo();
    }
    
      checkTitulo() {
        return { success: true, rta: null };
    }
}

export{Anuncio}