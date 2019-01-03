// Buscador de nombres de paises en una tabla
function buscadorDivisas() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("input_buscador_divisas");
  filter = input.value.toUpperCase();
  table = document.getElementById("tabla_divisas_disp_table");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) 
  {
    td = tr[i].getElementsByTagName("td")[4];

    if (td) 
    {
      txtValue = td.textContent || td.innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) 
      {
        tr[i].style.display = "";
      } 
      else 
      {
        tr[i].style.display = "none";
      }
    }       
  }
}

// Refrescar los labels cuando se selecciona una divisa
function selecDivisa(codigoISO, nombre){
  document.getElementById("paisSeleccionado_span").innerHTML = codigoISO;
  document.getElementById("paisSeleccionado_btn").innerHTML = nombre;
  cerrarPanelDivisas();
}

// Cerrar el panel que contiene los botones de las divisas
function cerrarPanelDivisas(){
  $("#panel_lista_paises").collapse("hide")
}

// Obtener las divisas marcadas como favoritas, los checks
function insertarDivisaFavorita(comp){
  var row = comp.parentNode.parentNode;
  var cols = row.getElementsByTagName("td");

  var pBandera = cols[1];
  var pCodigoISO = cols[2].textContent;
  var pSimbolo = cols[3].textContent;
  var pNombre = cols[4].textContent;

  if (validarInserción(pCodigoISO) == true)
  {
    insertarItemTablaFav(pBandera, pCodigoISO, pSimbolo, pNombre);
  }
}

// Validar si una divisa ya fue insertada
function validarInserción(codigoISO) {
  var table, tr, td, i;
  table = document.getElementById("tabla_divisas_favoritas");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) 
  {
    td = tr[i].getElementsByTagName("td")[1];

    if (td) 
    {
      if (td.textContent == codigoISO)
      {
        borrarFila(i, codigoISO);
        return false; // La divisa ya esta marcada como favorita
      }
    }       
  }
  return true; // no esta en la tabla, inserte la divisa
}

// Insertar elementos en la tabla de favoritos
function insertarItemTablaFav(bandera, codigoISO, simbolo, nombre) {
  var table = document.getElementById("tabla_divisas_favoritas");
  var row = table.insertRow(1);
  var cell_bandera = row.insertCell(0);
  var cell_codigoISO = row.insertCell(1);
  var cell_simbolo = row.insertCell(2);
  var cell_nombre = row.insertCell(3);
  var cell_input = row.insertCell(4);
  cell_bandera.innerHTML = "<img src=\'img/banderas/" + codigoISO + ".png\' class=\'img-rounded\'>";
  cell_codigoISO.innerHTML = codigoISO;
  cell_simbolo.innerHTML = simbolo;
  cell_nombre.innerHTML = nombre;
  cell_input.innerHTML = "<p>" + "0.0" + "</p>"; //"<input type=\'text\' class=\'form-control\' placeholder=\'0\' name=\'search\'>";
}

// Borrar una fila de la tabla de favoritos
function borrarFila(fila, codigoISO) {
  document.getElementById("tabla_divisas_favoritas").deleteRow(fila);
}

// Encargado de convertir la divisa
function convertirDivisa()
{
  var codigoISOSeleccionado = document.getElementById("paisSeleccionado_span");
  var valorDivisaIngresado = document.getElementById("valorDivisaIngr");
  
  var table, tr, divisaInput, divisaCodigoFav, i;
  table = document.getElementById("tabla_divisas_favoritas");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) 
  {
    divisaInput = tr[i].getElementsByTagName("td")[4];
    divisaCodigoFav = tr[i].getElementsByTagName("td")[1];

    if (divisaInput) 
    {
      //alert(codigoISOSeleccionado + "/" + divisaCodigoFav.textContent + " - " + valorDivisaIngresado);
      servicioDivisas(codigoISOSeleccionado.textContent, divisaCodigoFav.textContent, valorDivisaIngresado.value, divisaInput);
    }
  }
}

// Llamar al servicio web para convertir la divisa ingresada
function servicioDivisas(divisa1, divisa2, valorDivisaIngresado, obj_input){
  if (valorDivisaIngresado > 0){

    $("#cargandoDivisas").fadeIn();

    var HttpClient = function() {
      this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
          if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
          aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open("GET", aUrl, true); 
        anHttpRequest.send(null); 
      }
    }
    var query = divisa1 + '_' + divisa2;
    var theurl='https://free.currencyconverterapi.com/api/v6/convert?q=' + query + '&compact=y';
    //var apiKey = "1546|HvAZuCV8JwR243xjX8b0vKxp07nokg3J";
    //var theurl = "https://api.cambio.today/v1/quotes/" + divisa1 + "/" + divisa2 + "/json?quantity=" + valorDivisaIngresado + "&key=" + apiKey;
    var client = new HttpClient();

    client.get(theurl, function(response) {
      var response1 = JSON.parse(response);
      //alert(response);
      
      for (var clave in response1){
        // Controlando que json realmente tenga esa propiedad
        if (response1.hasOwnProperty(clave)) {
          obj_input.innerHTML = (response1[clave].val * valorDivisaIngresado);
        }
      }
      $("#cargandoDivisas").fadeOut();
    }); 
  }
/*
  var apiKey = "1546|HvAZuCV8JwR243xjX8b0vKxp07nokg3J";
  var theurl = "https://api.cambio.today/v1/quotes/" + divisa1 + "/" + divisa2 + "/json?quantity=" + valorDivisaIngresado + "&key=" + apiKey;

  $.ajax({
    'url': theurl,
    'type': "POST",
    'headers': {
                    'Access-Control-Allow-Origin': '*'
                },
    'crossDomain': true,
    'dataType': "jsonp",
    'data': {
          'format': 'json',
    },
    success: function (result) {
        JSON.parse(result);
    },
    error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr);
    }
});
*/
}

// https://api.cambio.today/v1/quotes/EUR/CRC/json?quantity=1&key=1546|HvAZuCV8JwR243xjX8b0vKxp07nokg3J
