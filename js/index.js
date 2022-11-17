


//Defino un JSON local con las variantes de los tipos de plásticos y hago un fetch

let variantes_plasticos //creo la variable donde van a entrar la respuesta del fetch

fetch("./js/materiales.json") 
        .then(response => response.json())
        .then(data => variantes_plasticos = data )


//EVENTOS DEL FORMULARIO

let range = document.getElementById("input_range");
let valor_actual = document.getElementById("texto_resultado");

//Advertencia con colores para tener un apoyo visual a la hora de elegir la densidad de la impresión 3D
range.addEventListener("input", function resultado() {
    valor_actual.innerHTML = range.value + "%"
    if (range.value > 80) {
        valor_actual.style.color = 'red';
        valor_actual.innerHTML = range.value + "% Densidad Alta"
    }
    else if (range.value > 50) {
        valor_actual.style.color = 'orange';
        valor_actual.innerHTML = range.value + "% Densidad Media/Alta"
    }

    else if (range.value <= 50 && range.value > 10) {
        valor_actual.style.color = 'green';
        valor_actual.innerHTML = range.value + "% Densidad Optima"
    }
    else {
        valor_actual.style.color = 'red';
        valor_actual.innerHTML = range.value + "% Densidad Baja"
    }
}, false);

//SEARCH DE MATERIALES

let formulario_busqueda = document.getElementById("form_busqueda");  //Capto el input del usuario

formulario_busqueda.addEventListener("submit", function (e) { //Dependiendo de la búsqueda realizada, muestro el material solicitado

    e.preventDefault();
    let input = document.getElementById("busqueda_material");

    if (input.value == "ABS" || input.value == "abs") {

        document.getElementById("card_pla").classList.remove("active");//Con la clase "ACTIVE" de bootstrap, logro que se muestre el material seleccionado y que no se vean los demás
        document.getElementById("card_abs").classList.add("active");
        document.getElementById("card_petg").classList.remove("active");
        document.getElementById("carrousel_cards").scrollIntoView({ behavior: 'smooth' }); //Aplico un scroll para la sección donde se encuentran los materiales. De ésta forma el usuario busca y ya se le dirige a la sección y no tiene que scrollear a mano
    }
    else if (input.value == "PETG" || input.value == "petg") {

        document.getElementById("card_pla").classList.remove("active");
        document.getElementById("card_abs").classList.remove("active");
        document.getElementById("card_petg").classList.add("active");
        document.getElementById("carrousel_cards").scrollIntoView({ behavior: 'smooth' });
    }
    else if (input.value == "PLA" || input.value == "pla") {

        document.getElementById("card_pla").classList.add("active");
        document.getElementById("card_abs").classList.remove("active");
        document.getElementById("card_petg").classList.remove("active");
        document.getElementById("carrousel_cards").scrollIntoView({ behavior: 'smooth' });

    }
    else {
        let aviso = document.createElement("h4");
        aviso.textContent = "No encontramos el material solicitado. Aquí tienes otras opciones: "; //En caso de no tener el material solicitado, se le avisa con un texto
        subtitulo.appendChild(aviso);
        document.getElementById("carrousel_cards").scrollIntoView({ behavior: 'smooth' });
    }

});


//DEFINO VARIABLES GLOBALES

let ancho
let largo
let alto
let unidad_elegida
let materiales
let material_seleccionado
let densidad_impresion
let presupuesto
let presupuestos_creados = [];

let num_presupuesto = 0;
let nombre_unidad_elegida

let formulario_presupuesto = document.getElementById("form_presupuesto");


//Constructor de objetos "Impresión" con clase

class Impresion {
    constructor(presupuesto, alto, ancho, largo, material, densidad, precio, unidad) {
        this.num_presupuesto = presupuesto;
        this.alto = alto;
        this.ancho = ancho;
        this.largo = largo;
        this.material_seleccionado = material;
        this.densidad_impresion = densidad;
        this.presupuesto = precio;
        this.nombre_unidad_elegida = unidad;

    }
};


//FUNCIONES


formulario_presupuesto.addEventListener("submit", function (e) {
    e.preventDefault(); //Evito que se pierdan los datos

    let medidas = document.getElementsByClassName("input_medidas"); //Capto los inputs del usuario

    ancho = medidas[0].value;
    largo = medidas[1].value;
    alto = medidas[2].value;


    if (document.getElementById('rad1').checked) {
        unidad_elegida = 1000;
        nombre_unidad_elegida = "mm";
    } else if (document.getElementById('rad2').checked) {
        unidad_elegida = 1;
        nombre_unidad_elegida = "cm";
    }

    material_seleccionado = document.getElementById("seleccion_filamento").value;
    densidad_impresion = document.getElementById("input_range").value;

    crear_presupuesto(); //Una vez con los datos obtenidos, llamo a la función para crear nuevo presupuesto

});


function crear_presupuesto() {

    if (unidad_elegida == 1) {
        if (ancho > 30 || alto > 30 || largo > 30) { //Verifico las medidas del objeto a cotizar.
            aviso_medidas.textContent = "El modelo excede el tamaño máximo de impresión (30cm x 30cm x 30cm)"; // Si se exceden del tamaño máximo, les aviso con un texto de color rojo
            aviso_medidas.style = "color: red;"


        } else if (material_seleccionado == "pla") {
            aviso_medidas.style = "display: none;"
            presupuesto = parseInt(((alto * ancho * largo) / unidad_elegida) * (variantes_plasticos[0].densidad * (densidad_impresion / 1000)) * variantes_plasticos[0].precio); //Calculo el presupuesto del objeto
            crear_fila_presupuesto();

        }
        else if (material_seleccionado == "petg") {
            aviso_medidas.style = "display: none;"
            presupuesto = parseInt(((alto * ancho * largo) / unidad_elegida) * (variantes_plasticos[2].densidad * (densidad_impresion / 1000)) * variantes_plasticos[2].precio);
            crear_fila_presupuesto();
        }
        else if (material_seleccionado == "abs") {
            aviso_medidas.style = "display: none;"
            presupuesto = parseInt(((alto * ancho * largo) / unidad_elegida) * (variantes_plasticos[1].densidad * (densidad_impresion / 1000)) * variantes_plasticos[1].precio);
            crear_fila_presupuesto();
        }
    } else if (unidad_elegida == 1000) {

        if (ancho > 300 || alto > 300 || largo > 300) {

            aviso_medidas.textContent = "El modelo excede el tamaño máximo de impresión (300mm x 300mm x 300mm)"; //Hago lo mismo pero en unidad de milímetros
            aviso_medidas.style = "color: red;"
        } else if (material_seleccionado == "pla") {
            aviso_medidas.style = "display: none;"
            presupuesto = parseInt(((alto * ancho * largo) / unidad_elegida) * (variantes_plasticos[0].densidad * (densidad_impresion / 1000)) * variantes_plasticos[0].precio);
            crear_fila_presupuesto();
        }
        else if (material_seleccionado == "petg") {
            aviso_medidas.style = "display: none;"
            presupuesto = parseInt(((alto * ancho * largo) / unidad_elegida) * (variantes_plasticos[2].densidad * (densidad_impresion / 1000)) * variantes_plasticos[2].precio);
            crear_fila_presupuesto();
        }
        else if (material_seleccionado == "abs") {
            aviso_medidas.style = "display: none;"
            presupuesto = parseInt(((alto * ancho * largo) / unidad_elegida) * (variantes_plasticos[1].densidad * (densidad_impresion / 1000)) * variantes_plasticos[1].precio);
            crear_fila_presupuesto();
        }
    }
}


function crear_fila_presupuesto() { //Una vez con el presupuesto hecho, voy agregando los mismos a medida que se van generando

    num_presupuesto = num_presupuesto + 1;
    let tabla = document.getElementById("tabla_presupuestos");
    tabla.innerHTML = ""; //Reseteo la tabla de preupuestos
    let titulos = document.createElement("tr"); //Creo nuevamente la tabla
    titulos.innerHTML = `<th>Número</th>
    <th>Dimensiones</th>
    <th>Material</th>
    <th>Densidad</th>
    <th>Precio</th>`;
    tabla.append(titulos);
    let fila = document.createElement("tr"); //Agrego los datos del último presupuesto
    fila.innerHTML = `<td>Presupuesto ${num_presupuesto}</td>
              <td>${ancho} x ${largo} x ${alto} ${nombre_unidad_elegida}</td>
              <td>${material_seleccionado}</td>              
              <td> ${densidad_impresion}%</td>
              <td>$ ${presupuesto}</td>`;

    tabla.append(fila);

    tabla.style = "display: block";

    let nueva_impresion = new Impresion(num_presupuesto, alto, ancho, largo, material_seleccionado, densidad_impresion, presupuesto, nombre_unidad_elegida);
    presupuestos_creados.push(nueva_impresion);//Pusheo los objetos al array
    sessionStorage.setItem("presupuestos", JSON.stringify(presupuestos_creados));//Guardo esa información en Session Storage para tener los presupuestos almacenados en la sesión



    //Despejo todos los campos de inputs para poder ingresar un nuevo presupuesto

    let inputs = document.getElementById("form_presupuesto");
    inputs.reset();
    valor_actual.innerHTML = "";

    //Hago una alerta de color verde para avisarle al usuario que el presupuesto se realizó correctamente

    Toastify({
        text: "Presupuesto creado",
        backgroundColor: "green",
        gravity:"bottom",
        duration: 3000
        
        }).showToast();

}



let historial = document.getElementById("historial");

//Función ver historial

historial.addEventListener("click", function () {
    let tabla_historial = document.getElementById("tabla_historial");



        let presupuestos = JSON.parse(sessionStorage.getItem("presupuestos"));//Obtengo esa información con el método getItem de storage.
        
        tabla_historial.innerHTML = '';  //Reseteo la tabla de datos del historial para que no siga sumando valores cada vez que clickeo en "Ver historial"
    
        tabla_historial.style = "display: block";
        let titulos = document.createElement("tr"); //Creo nuevamente la tabla
        titulos.innerHTML = `<th>Número</th>
        <th>Dimensiones</th>
        <th>Material</th>
        <th>Densidad</th>
        <th>Precio</th>`;
        tabla_historial.append(titulos);
    
    
        for (let i = 0; i <= presupuestos.length; i++) { //Recorro el Session storage para mostrar el historial de presupuestos    
    
            let fila = document.createElement("tr"); //Creo la fila con el presupuesto solicitado y toda su información
    
            fila.innerHTML = `<td>Presupuesto ${presupuestos[i].num_presupuesto}</td>
                  <td>${presupuestos[i].ancho} x ${presupuestos[i].largo} x ${presupuestos[i].alto} ${presupuestos[i].nombre_unidad_elegida}</td>
                  <td>${presupuestos[i].material_seleccionado}</td>              
                  <td> ${presupuestos[i].densidad_impresion}%</td>
                  <td>$ ${presupuestos[i].presupuesto}</td>`;
    
            tabla_historial.append(fila);    
    
        };        
      
});




























