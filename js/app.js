import { state } from "./state.js";
import { cargar } from "./storage.js";
import { render } from "./ui.js";

state.plantillas = cargar();
render();