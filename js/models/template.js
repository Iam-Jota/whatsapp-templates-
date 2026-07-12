class Template {
  constructor(titulo, mensaje, hashtag) {
    this.id = crypto.randomUUID();   // ← id único garantizado (ungygyg)
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.hashtag = hashtag;
    this.fecha = new Date();
  }
}