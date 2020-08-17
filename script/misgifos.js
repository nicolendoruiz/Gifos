let offset = 0;
let contenedor_misgifos = document.getElementById('misgifos-gifs');
let contenedor_sinmisgifos = document.getElementById('sin-misgifos');

cargarMisGifos();

/*_____________________VISUALIZAR MIS FAVORITOS DEL LOCAL STORAGE_____________________*/
async function cargarMisGifos(offset) {
    contenedor_misgifos.innerHTML = "";
    if (listado_misgifos.length > 0) {
        let puntoFinalMisGifos = `https://api.giphy.com/v1/gifs?ids=${listado_misgifos.toString()}&api_key=${APIkey}&limit=12&offset=${offset}`;
        let gifsGuardados = await logFetch(puntoFinalMisGifos);
        if (gifsGuardados.data.length > 0) {
            for (let i = 0; i < gifsGuardados.data.length; i++) {
                let div = document.createElement('div');
                let img = document.createElement('img');
                img.srcset = `${gifsGuardados.data[i].images.downsized_large.url}`;
                img.alt = `${gifsGuardados.data[i].id}`;
                div.appendChild(img);
                contenedor_misgifos.appendChild(div);
                contenedor_misgifos.classList.remove('hidden');
            }
        }
        console.log(gifsGuardados);
    } else {
        contenedor_misgifos.classList.add('hidden');
        contenedor_sinmisgifos.classList.remove('hidden');
    }
}