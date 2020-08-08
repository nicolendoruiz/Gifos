let input_busqueda = document.getElementById('in-busqueda');
let btn_busqueda = document.getElementById('btn-buscar');
let lista_sugerencias = document.getElementById('lista-busqueda');
let lupa_busqueda = document.getElementById('img-lupa');
let lupas_icon = document.getElementsByClassName('input_img');
let param_busqueda;

input_busqueda.addEventListener('keyup', cargarSugerencias);

async function cargarSugerencias() {
    param_busqueda = input_busqueda.value;
    let puntoFinalSugerencias = `https://api.giphy.com/v1/tags/related/${param_busqueda}?api_key=${APIkey}&limit=4&rating=g`;
    let sugerenciasBusqueda = await logFetch(puntoFinalSugerencias);
    if (sugerenciasBusqueda.data.length > 0) {
        let items_lista = "";
        for (let i = 0; i < sugerenciasBusqueda.data.length; i++) {
            let items = `<li><img src="images/icon-search-gris.svg" alt="icon-search"/><p>${sugerenciasBusqueda.data[0].name}</p></li>`;
            items_lista = items_lista + items;
        }
        lista_sugerencias.innerHTML = items_lista;
        lista_sugerencias.classList.remove('hidden');
        lista_sugerencias.classList.add('lista-busqueda');
        lupa_busqueda.classList.add('img-lupa','hidden');
        lupa_busqueda.classList.remove('hidden');
        input_busqueda.style.width='80%';
        lupas_icon[0].style.display='none';
        lupas_icon[1].style.display='block';
    } else {
        lista_sugerencias.classList.add('hidden');
        lista_sugerencias.classList.remove('lista-busqueda');
        lupa_busqueda.classList.remove('img-lupa','hidden');
        lupa_busqueda.classList.add('hidden');
        input_busqueda.style.width='90%';
        lupas_icon[0].style.display='block';
        lupas_icon[1].style.display='none';
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
            let div = document.createElement('div');
            let img = document.createElement('img');
            img.srcset = `${resultadosBusqueda.data[i].images.downsized_large.url}`;
            img.alt = `${resultadosBusqueda.data[i].title}`;
            div.appendChild(img);
            resultados.appendChild(div);
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
