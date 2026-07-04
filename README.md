Plantillas WhatsApp

Aplicación web para crear, guardar y reutilizar plantillas de mensajes de WhatsApp con reemplazo dinámico de variables.


Clase Template

Ubicada en js/models/Template.js, representa una plantilla de mensaje.

jsclass Template {
  constructor(titulo, mensaje, hashtag) {
    this.titulo  = titulo;
    this.mensaje = mensaje;
    this.hashtag = hashtag;
    this.fecha   = new Date();
  }
}

PropiedadTipoDescripcióntituloStringNombre identificador de la plantillamensajeStringCuerpo del mensaje, puede contener {nombre} como variablehashtagStringEtiqueta de categoría (siempre empieza con #)fechaDateFecha y hora de creación, generada automáticamente


Métodos de String utilizados

String.trim()

Elimina los espacios en blanco al inicio y al final de un texto.

js
const tituloTexto = titulo.value.trim();

Se usa para validar que el usuario no envíe campos vacíos o rellenos solo de espacios.



String.toLowerCase()

Convierte todo el texto a minúsculas.

js
const limpio = texto.trim().toLowerCase();

Se usa en normalizarHashtag() para estandarizar el hashtag sin importar cómo lo escriba el usuario (Gym, GYM o gym → siempre #gym).



String.startsWith()

Comprueba si un texto empieza con un carácter o subcadena específica.

js
return limpio.startsWith("#") ? limpio : "#" + limpio;

Se usa también en normalizarHashtag() para evitar hashtags duplicados como ##gym en caso de que el usuario ya haya escrito el #.


String.replaceAll()

Reemplaza todas las apariciones de una subcadena por otra.

js
return plantilla.mensaje.replaceAll("{nombre}", valorNombre);

Es el corazón del generador de mensajes: sustituye cada {nombre} dentro del mensaje por el nombre real que el usuario escribió, permitiendo personalizar el mismo mensaje para distintos destinatarios.

<h1>Estructura del proyecto<h1>

plantillas-whatsapp/
├── index.html
├── js/
│   ├── models/
│   │   └── Template.js
│   └── app.js