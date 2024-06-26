import { escribir,jsonToObject,leer,objectToJson,limpiar } from "./local-storage.js";
import {Planeta} from "./Planeta.js"

const KEY_STORAGE = "planetas";
let items = []; // array vacio
const formulario = document.forms[0];
const btnGuardar = document.getElementById("btnGuardar");
const btnEliminar = document.getElementById("btnEliminar");
const btnCancelar = document.getElementById("btnCancelar");
const btnModificar = document.getElementById("btnModificar");

document.addEventListener('DOMContentLoaded', onInit)

function onInit(){
    loadItems();
    rellenarTabla();
    escuchandoFormulario();
    cargarOpciones(['rocoso', 'gaseoso', 'helado', 'enano' ]);
    document.addEventListener('click', handlerClick);
    btnEliminar.addEventListener('click', handlreEliminarAnuncio);
    btnCancelar.addEventListener('click', handlerCancelar);
    btnModificar.addEventListener('click', handlreModificarAnuncio);
}

async function loadItems() {
    let str = await leer(KEY_STORAGE);
    const objetos = jsonToObject(str) || [];

    objetos.forEach(obj => {
        const model = new Planeta(
            obj.id,
            obj.nombre,
            obj.tamanio,
            obj.masa,
            obj.tipo,
            obj.distancia,
            obj.vida,
            obj.anillo,
            obj.compAtmosfera
        );
    
        items.push(model);
    });
    inyectarSpinner();
    setTimeout(()=>{
      removerSpinner();
      rellenarTabla();
    },2500)
}

function cargarOpciones(lista){
  const listaOpciones = document.getElementById('selectTipo');
  lista.forEach(element => {
      let option = document.createElement('option');
      option.id = lista.indexOf(element)+1;
      option.textContent = element;
      option.value = element;
      listaOpciones.appendChild(option);
  });
}

function rellenarTabla() {
  const tabla = createTable(items);
  const contenedor = document.getElementById('divTabla');
  renderizarTable(tabla,contenedor);
}

function renderizarTable(tabla, contenedor) {
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }
  if (tabla) {
    contenedor.appendChild(tabla);
  }
}

  function escuchandoFormulario() {
    formulario.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const model = new Planeta(
        Date.now(),
        formulario.nombre.value,
        formulario.tamanio.value,
        formulario.masa.value,
        formulario.tipo.value,
        formulario.distancia.value,
        formulario.vida.value,
        formulario.anillo.value,
        formulario.compAtmosfera.value
      );

      const respuesta = model.verify();

      if(!parseFloat(formulario.distancia.value)){
        alert("La distancia debe ser numerica");
        respuesta = respuesta.rta;
      }

      if(!parseFloat(formulario.distancia.value)){
        alert("La distancia debe ser numerica");
        respuesta = respuesta.rta;
      }

      if(!parseFloat(formulario.tamanio.value)){
        alert("El tamanño debe ser numerico");
        respuesta = respuesta.rta;
      }

      if(formulario.vida.checked){
        model.vida = 'Si';
      }
      else{
        model.vida = "No";
      }

      if(formulario.anillo.checked){
        model.anillo = 'Si';
      }
      else{
        model.anillo = "No";
      }
  
      if (respuesta.success) {
        inyectarSpinner();
        setTimeout(()=>{
          items.push(model);
        const str = objectToJson(items);
        escribir(KEY_STORAGE, str);
        removerSpinner();
        actualizarFormulario();
        rellenarTabla();
        },2500)
      }
      else {
          alert(respuesta.rta);
      }
    });
}

  function actualizarFormulario() {
    formulario.reset();
}

/**
 * Crea la tabla
 */
function createTable(items) {
  const tabla = document.createElement("table");
  tabla.appendChild(createThead(items[0]));
  tabla.appendChild(createTbody(items));
  return tabla;
}

function createThead(items) {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  for (const key in items) {
    const th = document.createElement("th");
    th.textContent = key;
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  return thead;
}

function createTbody(items) {
  const tbody = document.createElement("tbody");
  items.forEach((element) => {
    const tr = document.createElement("tr");
    for (const key in element) {
      if (key === "id") {
        tr.setAttribute("data-id", element[key]);
      } 
      const td = document.createElement("td");
      td.textContent = element[key];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  return tbody;
}

function cargarFormulario(formulario, ...datos) {
  //metodo que cargar el formulario con datos segun un ID recibido

  formulario.id.value = datos[0]; // este atributo esta como hidden, oculto
  formulario.nombre.value = datos[1];
  formulario.tamanio.value = datos[2];
  formulario.masa.value = datos[3];
  formulario.tipo.value = datos[4];
  formulario.distancia.value = datos[5];
  formulario.vida.value = datos[6];
  formulario.anillo.value = datos[7];
  formulario.compAtmosfera.value = datos[8];
}

function modificarFuncionBoton(target) {
  if (target.matches("td")) {
    btnGuardar.setAttribute("class", "oculto");
    btnEliminar.removeAttribute("class");
    btnCancelar.removeAttribute("class");
    btnModificar.removeAttribute("class");
  } else {
    btnGuardar.removeAttribute("class");
    btnEliminar.setAttribute("class", "oculto");
    btnCancelar.setAttribute("class", "oculto");
    btnModificar.setAttribute("class", "oculto");
  }
}

function handlerCancelar(e){
  actualizarFormulario();
  modificarFuncionBoton(e.target);
}

function handlerClick(e) {
  if (e.target.matches("td")) {
    //console.log(e.target.parentNode.dataset.id); // el id lo recupero asi porque lo meti en data-id,

    let id = e.target.parentNode.dataset.id;

    const planeta = items.filter((p) => p.id === parseInt(id))[0]; //filter devuelve un array de las coincidencias, entonces le paso la pos 0
    console.log("🚀 ~ handlerClick ~ planeta:", planeta);
    cargarFormulario(
      formulario,
      id,
      planeta.nombre,
      planeta.tamanio,
      planeta.masa,
      planeta.tipo,
      planeta.distancia,
      planeta.vida,
      planeta.anillo,
      planeta.compAtmosfera
    );
    modificarFuncionBoton(e.target);
  }else if (!e.target.matches("input")) {
    actualizarFormulario();
    modificarFuncionBoton(e.target);
  }
}

function handlreEliminarAnuncio(e) {
  if (confirm("Confirma la Eliminacion")) {
    inyectarSpinner();
    setTimeout(() => {
      let id = parseInt(formulario.id.value);
      let itemsAux = items.filter((p) => p.id != id);
      items = itemsAux;
      const str = objectToJson(items);
      escribir(KEY_STORAGE,str);
      removerSpinner();
      rellenarTabla();
      actualizarFormulario();
      modificarFuncionBoton(e.target);
    }, 3000);
  }
}

function handlreModificarAnuncio(e) {
  if (confirm("Confirma la Modificacion")) {
    inyectarSpinner();
    setTimeout(() => {
      let id = parseInt(formulario.id.value);
      items.forEach(element=>{
        if(element.id == id){
          element.id = Date.now();
          element.nombre = formulario.nombre.value;
          element.tamanio = formulario.tamanio.value;
          element.masa = formulario.masa.value;
          element.tipo = formulario.tipo.value;
          element.distancia = formulario.distancia.value;
          element.vida = formulario.vida.value;
          element.anillo = formulario.anillo.value;
          element.compAtmosfera = formulario.compAtmosfera.value;
        }
      })
      const str = objectToJson(items);
      escribir(KEY_STORAGE,str);
      removerSpinner()
      rellenarTabla();
      modificarFuncionBoton(e.target);
      actualizarFormulario();
    }, 3000);
  }
}

function inyectarSpinner() {
  const spinner = document.createElement("img");
  const contenedor = document.getElementById("spinner-container");
  spinner.setAttribute("src", "./img/logo.svg");
  spinner.setAttribute("alt", "imagen spinner");
  spinner.setAttribute("height", "64px");
  spinner.setAttribute("width", "64px");
  spinner.setAttribute("id","spinner");
  contenedor.appendChild(spinner);
}

function removerSpinner() {
  const contenedor = document.getElementById("spinner-container");
  contenedor.removeChild(contenedor.firstChild);
}