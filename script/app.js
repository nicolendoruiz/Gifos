window.onload = function () {
    cambioTema();
    cargarTrending();
    cargarSugerencias();
    cargarBusqueda("perro");
};

window.onscroll = function () { addStickyNavbar() };

var navbar = document.getElementById('navbar');
var sticky = navbar.offsetTop;

function addStickyNavbar() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add('sticky-nav')
    } else {
        navbar.classList.remove('sticky-nav');
    }
}

/*_____________________MENÚ HAMBURGUESA_____________________*/
let btnmenu = document.getElementById('menu-burguer');
btnmenu.addEventListener("click", function () {
    document.getElementById('ul-menu').classList.toggle("menudesplegado");
    btnmenu.classList.toggle("menudesplegado");
})

/*_____________________MODO NOCTURNO_____________________*/

let tema = localStorage.getItem('mode');
let cambioTema = () => {
    tema === 'dark'
        ? document.documentElement.setAttribute('data-theme', 'dark')
        : document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('sp-tema').innerHTML = tema == 'dark' ? 'Diurno' : 'Nocturno';
}

document.getElementById('liModoMocturno').addEventListener("click", function (e) {
    tema = (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mode', tema);
    cambioTema();
})

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
    // for (let i = 0; i < gifsTrending.data.length; i++) {
    //     let contenedor = document.getElementById(`img-${i}`);
    //     let url = gifsTrending.data[i].images.downsized_large.url;
    //     contenedor.srcset = url;
    // }
}

async function cargarSugerencias() {
    let puntoFinalSugerencias = `https://api.giphy.com/v1/tags/related/n?api_key=${APIkey}&limit=4&rating=g`;
    let sugerenciasBusqueda = await logFetch(puntoFinalSugerencias);
    console.log(sugerenciasBusqueda);
    for (let i = 0; i < sugerenciasBusqueda.data.length; i++) {
        let listabusqueda = document.getElementById('lista-busqueda');
        let li = document.createElement("li");
        li.innerHTML = `${sugerenciasBusqueda.data[i].name}`;
        listabusqueda.appendChild(li);
        listabusqueda.classList.remove('hidden');
        listabusqueda.classList.add("lista-busqueda");
    }
}

async function cargarBusqueda(parametro) {
    let puntoFinalBusqueda = `https://api.giphy.com/v1/gifs/search?api_key=${APIkey}&limit=12&q=${parametro}`;
    let resultadosBusqueda = await logFetch(puntoFinalBusqueda);

    let titulo = document.getElementById('titulo-resultados');
    let resultados = document.getElementById('resultados-gifs');

    console.log(resultadosBusqueda);
    if (resultadosBusqueda.data.length > 0) {
        for (let i = 0; i < resultadosBusqueda.data.length; i++) {
            $("<div/>").css("background-image", `url(${resultadosBusqueda.data[i].images.downsized_large.url})`).appendTo('#resultados-gifs');
            resultados.classList.remove('hidden');
        }
        titulo.innerHTML = `${parametro}`;
    } else {
        resultados.classList.remove('resultados-gifs', 'hidden');
        resultados.classList.add('d-sinresultados');
        titulo.innerHTML = 'Lorem Ipsum';
        let imagen = document.createElement('img');
        imagen.srcset = './images/icon-busqueda-sin-resultado.svg';
        imagen.classList.add('img-sinresultados');
        resultados.appendChild(imagen);
        let texto = document.createElement('h3');
        texto.innerHTML = "Intenta con otra búsqueda";
        texto.classList.add('text-sinresultados');
        resultados.appendChild(texto);
    }
}
