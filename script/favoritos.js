let listado_favoritos = obtenerListadoFavoritos();
let offset = 0;

function obtenerListadoFavoritos() {
    return JSON.parse(localStorage.getItem('gifsFavoritos'));
}

cargarFavoritos();

async function cargarFavoritos(offset) {
    let puntoFinalFavoritos = `https://api.giphy.com/v1/gifs?ids=${listado_favoritos.toString()}&api_key=${APIkey}&limit=12&offset=${offset}`;
    let gifsFavoritos = await logFetch(puntoFinalFavoritos);
    console.log(gifsFavoritos);
}