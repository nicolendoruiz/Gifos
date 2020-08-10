let listado_favoritos = obtenerListadoFavoritos();
let offset = 0;
let contenedor_favoritos = document.getElementById('favoritos-gifs');
let contenedor_sinfavoritos =document.getElementById('sin-favoritos');

cargarFavoritos();

async function cargarFavoritos(offset) {
    if (listado_favoritos.length > 0) {
        let puntoFinalFavoritos = `https://api.giphy.com/v1/gifs?ids=${listado_favoritos.toString()}&api_key=${APIkey}&limit=12&offset=${offset}`;
        let gifsFavoritos = await logFetch(puntoFinalFavoritos);
        if (gifsFavoritos.data.length > 0) {
            for (let i = 0; i < gifsFavoritos.data.length; i++) {
                let div = document.createElement('div');
                let img = document.createElement('img');
                img.srcset = `${gifsFavoritos.data[i].images.downsized_large.url}`;
                img.alt = `${gifsFavoritos.data[i].id}`;
                div.appendChild(img);
                contenedor_favoritos.appendChild(div);
                contenedor_favoritos.classList.remove('hidden');
            }
        } 
        console.log(gifsFavoritos);
    }else{
        contenedor_favoritos.classList.add('hidden');
        contenedor_sinfavoritos.classList.remove('hidden');
    }
}