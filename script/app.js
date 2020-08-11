window.onload = function () {
    cambioTema();
    cargarTrending();
    if (!obtenerListadoFavoritos()) {
        localStorage.setItem('gifsFavoritos', JSON.stringify([]));
    }
    if (!obtenerListadoGifsGuardados()) {
        localStorage.setItem('gifsGuardados', JSON.stringify([]));
    }
};

/*_____________________NAVBAR STICKY_____________________*/
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

/*_____________________FUNCIONAMIENTOS TRENDING MOBILE_____________________*/
const track = document.getElementById('contenedor-cards');
if (!!track) {
    let initialPosition = null;
    let moving = false;
    let transform = 0;
    const gestureStart = (e) => {
        initialPosition = e.pageX;
        moving = true;
        const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
        if (transformMatrix !== 'none') {
            transform = parseInt(transformMatrix.split(',')[4].trim());
        }
    }
    const gestureMove = (e) => {
        if (moving) {
            const currentPosition = e.pageX;
            const diff = currentPosition - initialPosition;
            track.style.transform = `translateX(${transform + diff}px)`;
        }
    };
    const gestureEnd = (e) => {
        moving = false;
    }

    if (window.PointerEvent) {
        window.addEventListener('pointerdown', gestureStart);
        window.addEventListener('pointermove', gestureMove);
        window.addEventListener('pointerup', gestureEnd);
    } else {
        window.addEventListener('touchdown', gestureStart);
        window.addEventListener('touchmove', gestureMove);
        window.addEventListener('touchup', gestureEnd);
        window.addEventListener('mousedown', gestureStart);
        window.addEventListener('mousemove', gestureMove);
        window.addEventListener('mouseup', gestureEnd);
    }
}

/*_____________________GENERALIDADES GIPHY_____________________*/
const APIkey = "HBbQgzW5Bryp891jwDofkTaAyDKxBWiU";

async function logFetch(url) {
    return fetch(url)
        .then((data) => {
            return data.json();
        })
        .catch(error => console.error('Error:', error));
};

/*_____________________CARGUE INFORMACIÓN DE TRENDING_____________________*/
async function cargarTrending() {
    let puntoFinalTendencia = `https://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=12`;
    let gifsTrending = await logFetch(puntoFinalTendencia);
    console.log(gifsTrending);
    let contenedor = document.getElementById('contenedor-cards');
    for (let i = 0; i < gifsTrending.data.length; i++) {
        let divtrending = document.createElement('div');
        let imggif = document.createElement('img');
        divtrending.classList.add('card');
        divtrending.innerHTML = `<div id="${gifsTrending.data[i].id}" class="card-opciones">
                                    <div class="opciones-gif">
                                        <button id="btn-favorito" class="opcion-button">
                                            <img src="images/icon-fav-hover.svg" alt="icono-favorito">
                                        </button>
                                        <button id="btn-descargar" class="opcion-button">
                                            <img src="images/icon-download.svg" alt="icono-descarga">
                                        </button>
                                        <button id="btn-max" class="opcion-button">
                                            <img src="images/icon-max.svg" alt="icono-maximizar">
                                        </button>
                                    </div>
                                    <div class="opciones-descripcion">
                                        <p class="descripcion user">${gifsTrending.data[i].username}</p>
                                        <p class="descripcion titulo">${gifsTrending.data[i].title}</p>
                                    </div>
                                </div>`;
        divtrending.querySelector('#btn-favorito').addEventListener('click', () => {
            agregarFavoritos(gifsTrending.data[i].id);
        });
        divtrending.querySelector('#btn-descargar').addEventListener('click', () => {
            descargarGif(gifsTrending.data[i].images.original.url);
        });
        divtrending.querySelector('#btn-max').addEventListener('click', () => {
            maximizarGif(gifsTrending.data[i].id);
        });
        divtrending.addEventListener('click', () => {
            maximizarGif(gifsTrending.data[i].id);
        })
        imggif.srcset = `${gifsTrending.data[i].images.downsized_large.url}`
        imggif.alt = `${gifsTrending.data[i].id}`;
        divtrending.appendChild(imggif);
        if (!!contenedor) {
            contenedor.appendChild(divtrending);
        }
    }
};

function obtenerListadoFavoritos() {
    return JSON.parse(localStorage.getItem('gifsFavoritos'));
}

function obtenerListadoGifsGuardados() {
    return JSON.parse(localStorage.getItem('gifsGuardados'));
}

function agregarFavoritos(nuevoGifFavoritoId) {
    console.log(listado_favoritos);
    listado_favoritos.push(nuevoGifFavoritoId);
    localStorage.setItem('gifsFavoritos', JSON.stringify(listado_favoritos));
    cargarFavoritos();
}

async function maximizarGif(idGif) {
    if (!!idGif) {
        let puntoFinalGif = `https://api.giphy.com/v1/gifs/${idGif}?api_key=${APIkey}`;
        let gifInfo = await logFetch(puntoFinalGif);
        let contenedor_maximizado = document.getElementById('gif-max');
        contenedor_maximizado.style.display = 'flex';
        contenedor_maximizado.innerHTML =
            `<button id="btnmax-close" class="close-button">
                    <img src="images/close.svg" alt="icono-busqueda">
             </button>
             <img srcset="${gifInfo.data.images.downsized_large.url}"
                    alt="${gifInfo.data.id}" id="img-maximizado" class="gif-maximizado">
             <article>
                   <div>
                       <p>${gifInfo.data.username}</p>
                       <p class="titulo">${gifInfo.data.title}</p>
                   </div>
                   <div class="maximizado-opciones">
                       <button id="btnmax-favorito">
                           <img src="images/icon-fav-hover.svg" alt="icono-busqueda">
                       </button>
                       <button id="btnmax-descarga">
                           <img src="images/icon-download.svg" alt="icono-busqueda">
                       </button>
                   </div>
             </article>`;
        contenedor_maximizado.querySelector('#btnmax-favorito').addEventListener('click', () => {
            agregarFavoritos(gifInfo.data.id);
        });
        contenedor_maximizado.querySelector('#btnmax-descarga').addEventListener('click', () => {
            descargarGif(gifInfo.data.images.original.url);
        });
        contenedor_maximizado.querySelector('#btnmax-close').addEventListener('click', () => {
            contenedor_maximizado.style.display = 'none';
        });
    }
};

async function descargarGif(urlGif) {
    let blob = await fetch(urlGif).then(data => data.blob());;
    invokeSaveAsDialog(blob, "gifos.gif");
}