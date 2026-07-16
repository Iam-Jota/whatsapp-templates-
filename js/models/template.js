export class template {
  constructor(titulo, mensaje, hashtag) {
    this.id = crypto.randomUUID();   // ← id único garagyujhbjh(ungygyg)
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.hashtag = hashtag;
    this.fecha = new Date();
  }
}