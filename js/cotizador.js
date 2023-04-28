var edad = 0;
var dias = 0;
var datos;
var URLserver = "https://si0sgs.github.io/apiJSON/generaciones.json";
var nombreGeneracion = "";
var fechaN = 0;


// Esta función calcula el total de días entre dos fechas 
// Los parámetros de entrada deben ser fechas en formato String
function calcularDias(fechaIni, fechaFin) {
    var dias = 0;
    try {
        if (fechaIni != "" && fechaFin != "") {
            var fechaI = new Date(fechaIni);
            var fechaF = new Date(fechaFin);
            var diasDif = fechaF.getTime() - fechaI.getTime();
            dias = Math.round(diasDif / (1000 * 60 * 60 * 24)) + 1;
            return dias;
        }
        else
            return 0;
    } catch (error) {
        return 0;
    }

}

function calcularEdad() {

    const fechaNacimiento = new Date(document.getElementById("fnace").value);
    const edadEnMilisegundos = Date.now() - fechaNacimiento.getTime();
    const edad = new Date(edadEnMilisegundos).getFullYear() - 1970;

    return edad;
}

function cambiarFecha() {
    edad = calcularEdad();
    cargarImagenes();
    fechaN = 1;

}

function cargarPaises() {

    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://covid-193.p.rapidapi.com/countries',
        method: 'GET',
        headers: {
            'content-type': 'application/octet-stream',
            'X-RapidAPI-Key': '825b342a1emsh37c5e95ab30ceb2p12053fjsn69efec47682d',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {
        var rayPaises;
        console.log(response);
        rayPaises = response.response;

        for (var i in rayPaises) {
            document.getElementById("cboPais").innerHTML += "<option value='" + rayPaises[i] + "'>" + rayPaises[i] + "</option>";

        }
    });

    callService();

}


function callService() {

    $.ajax({
        url: URLserver,
        type: "get",
        dataType: "json",
        success: onSuccess,
        error: onError
    });
}

function onError(jqXHR, textStatus, errorThrown) {
    alert("Mensaje de Error " + errorThrown);
}

function onSuccess(data) {

    datos = data;

}

function cargarImagenes() {
    let imagen = document.getElementById("imgGeneracion");

    datos.generaciones.forEach(generacion => {

        if (edad >= generacion.edadinicio && edad <= generacion.edadfin) {
            imagen.src = generacion.imagen;
            nombreGeneracion = generacion.nombre;
        }

    });


}

function cotizar() {
    let costoXtipo = 0;
    let tipo = document.getElementById("cbotSeguro").value;
    let mensaje = document.getElementById("msgCotiza");
    let contenedor=document.getElementById("contenedorCotiza");
    contenedor.style.display="";
    let total=0;
    dias = calcularDias(document.getElementById("fIngreso").value, document.getElementById("fSalida").value);


    if (nombreGeneracion == "Builders" || nombreGeneracion == "BabbyBoomers") {

        mensaje.innerText = "La generación Builders o BabbyBoomers, no se puede asegurar en este momento";
        return;
    } else if (fechaN == 0) {

        mensaje.innerText = "Debe indicar una fecha de nacimiento";

        return;
    }


    if (document.getElementById("fIngreso").value == 0 || document.getElementById("fSalida").value == 0) {
        dias = 0;
    }


    if (tipo == "SC") {
        costoXtipo = 20;
    } else {
        costoXtipo = 45;
    }

total=dias*costoXtipo;

mensaje.innerText="Costo del seguro "+tipo+" es de "+total+" para "+dias+" días."

}






window.onload = cargarPaises;


