window.onload = function () {
    cambioTema();
    cargarTrending();
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
    let contenedor = document.getElementById('contenedor-cards');
    for (let i = 0; i < gifsTrending.data.length; i++) {
        let divtrending = document.createElement('div');
        let imggif = document.createElement('img');
        divtrending.classList.add('card');
        imggif.srcset = `${gifsTrending.data[i].images.downsized_large.url}`
        imggif.alt = `${gifsTrending.data[i].title}`;
        divtrending.appendChild(imggif);
        if (!!contenedor) {
            contenedor.appendChild(divtrending);
        }
    }
};
