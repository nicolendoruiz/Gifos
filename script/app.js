window.onload = function () {
    cambioTema();
    cargarTrending();
    cargarBusqueda();
};

/*_____________________MENÚ HAMBURGUESA_____________________*/

$('.menu-burger').on('click', function (e) {
    $('#ul-menu').toggleClass('menudesplegado');
    $('.menu-burger').toggleClass('menudesplegado');
});

/*_____________________MODO NOCTURNO_____________________*/

let tema = localStorage.getItem('mode');
let cambioTema = () => {
    tema === 'dark'
        ? document.documentElement.setAttribute('data-theme', 'dark')
        : document.documentElement.setAttribute('data-theme', 'light');
    $('#sp-tema').text(tema == 'dark' ? 'Diurno' : 'Nocturno');
}

$('#liModoMocturno').on('click', function (e) {
    tema = (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mode', tema);
    cambioTema();
});

/*_____________________GIPHY_____________________*/

const APIkey = "HBbQgzW5Bryp891jwDofkTaAyDKxBWiU";

async function logFetch(url) {
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.log('Error al cargar los datos', error);
    }
}

// async function cargarTrending() {
//     let gifsTrending = await logFetch(puntoFinalTendencia);
//     console.log(gifsTrending);
//     for (let i = 0; i < gifsTrending.data.length; i++) {
//         let contenedor = document.getElementById(`img-${i}`);
//         let url = gifsTrending.data[i].images.downsized_large.url;
//         contenedor.srcset = url;
//     }
// }
async function cargarTrending() {
    let puntoFinalTendencia = `https://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=2`;
    let gifsTrending = await logFetch(puntoFinalTendencia);
    console.log(gifsTrending);
    for (let i = 0; i < gifsTrending.data.length; i++) {
        let contenedor = document.getElementById(`img-${i}`);
        let url = gifsTrending.data[i].images.downsized_large.url;
        contenedor.srcset = url;
    }
}

async function cargarBusqueda() {
    let puntoFinalSugerencias = `https://api.giphy.com/v1/tags/related/n?api_key=${APIkey}&limit=4&rating=g`;
    let sugerenciasBusqueda = await logFetch(puntoFinalSugerencias);
    console.log(sugerenciasBusqueda);
    for (let i = 0; i < sugerenciasBusqueda.data.length; i++) {
        $("#lista-busqueda").append(`<li>${sugerenciasBusqueda.data[i].name}</li>`);
        $("#lista-busqueda").removeClass('hidden');
        $("#lista-busqueda").addClass('lista-busqueda');
    }
}
