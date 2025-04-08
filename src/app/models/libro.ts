export class Libro {
    idLibro: number;
    titulo: string;
    idAutor: number;
    anioPublicacion?: number;
    categoria?: string;
    existencias: number;

    constructor(
        idLibro: number,
        titulo: string,
        idAutor: number,
        existencias: number,
        anioPublicacion?: number,
        categoria?: string
    ) {
        this.idLibro = idLibro;
        this.titulo = titulo;
        this.idAutor = idAutor;
        this.anioPublicacion = anioPublicacion;
        this.categoria = categoria;
        this.existencias = existencias;
    }
}