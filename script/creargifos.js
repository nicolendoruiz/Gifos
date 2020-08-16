//Elementos
let div_descripcion = document.getElementById('div-descripcion');
let img_gif = document.getElementById('gif-grabado');
let pasos = document.getElementsByClassName('paso');
let contador = document.getElementById('contador-grabacion');
let img_subirgifo = document.getElementById('img-subirgifo');
let texto_subirgifo = document.getElementById('texto-subirgifo');
let div_subirgifo = document.getElementById('div-subirgifo');
let div_opcionesgifo = document.getElementById('opciones-gifo');

let btn_iniciar = document.getElementById('btn-comenzar');
let btn_grabar = document.getElementById('btn-grabar');
let btn_finalizar = document.getElementById('btn-finalizar');
let btn_subir = document.getElementById('btn-subir');
let btn_repetir = document.getElementById('btn-repetir');
let btn_descargar = document.getElementById('btn-descargar');
let btn_link = document.getElementById('btn-link');

var video = document.querySelector('video');
let form = new FormData();
let stream, recorder, blob, info;
let listado_misgifos = obtenerListadoGifsGuardados();
let segundos, minutos, horas, intervalo;

/*_____________________EVENTOS BOTONES_____________________*/
btn_iniciar.addEventListener("click", () => {
    iniciarVisual();
    iniciarPermisosGrabacion();
});

btn_grabar.addEventListener("click", iniciarGrabacion);

btn_repetir.addEventListener("click", repitirGrabacion);

btn_finalizar.addEventListener("click", pararGrabacion);

btn_subir.addEventListener('click', async () => {
    pasos[1].classList.remove('pasoactivo');
    pasos[2].classList.add('pasoactivo');
    subirGifGrabado();
});

/*_____________________FUNCIONES GRABACIÓN_____________________*/
function iniciarVisual() {
    div_descripcion.innerHTML = "<h2>¿Nos das acceso </br> a tu cámara?</h2><p>El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.</p>";
    btn_iniciar.hidden = true;

    pasos[0].classList.add('pasoactivo');
}

function iniciarPermisosGrabacion() {
    //opciones de video
    var constraints = { audio: false, video: { width: 480, height: 320 } };
    //permisos para la captura de vídeo
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            recorder = RecordRTC(stream, {
                type: 'gif'
            });
            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play();
            }
            btn_grabar.hidden = false;
            pasos[0].classList.remove('pasoactivo');
            pasos[1].classList.add('pasoactivo');
        }).catch(function (error) {
            alert('Debes permitir el acceso a tu cámara para continuar');
            console.error(error);
        });
}

function iniciarGrabacion() {
    recorder.startRecording();
    console.log('grabando');

    btn_grabar.hidden = true;
    btn_finalizar.hidden = false;

    contador.hidden = false;

    segundos = 0, minutos = 0, horas = 0;
    intervalo = setInterval(() => {
        segundos++;
        contador.innerHTML = segundos;
        if (segundos == 60) {
            minutos++;
            segundos = 0;
        }
        if (minutos == 60) {
            horas++;
            minutos = 0;
        }
        contador.innerHTML = `${horas}:${minutos}:${segundos}`;
    }, 1000);
}

function pararGrabacion() {
    recorder.stopRecording(function () {
        blob = recorder.getBlob();

        form.append('file', blob, 'myGif.gif');
        form.append('api_key', APIkey);
        console.log(form.get('file'));

        img_gif.hidden = false;
        img_gif.src = URL.createObjectURL(blob);

        btn_subir.hidden = false;
        btn_finalizar.hidden = true;
        btn_repetir.hidden = false;
        contador.hidden = true;
    });
}

function repitirGrabacion() {
    recorder.clearRecordedData();
    img_gif.hidden = true;

    console.log('repetir');

    iniciarPermisosGrabacion();
    form.delete('file');

    btn_subir.hidden = true;
    btn_repetir.hidden = true;

    iniciarPermisosGrabacion();
}

/*_____________________SUBIR GIFO A GIPHY (POST API)_____________________*/
function subirGifGrabado() {
    div_subirgifo.hidden = false;
    fetch(`https://upload.giphy.com/v1/gifs`, {
        method: 'POST',
        body: form
    }).then(data => {
        return data.json();
    }).then(datos => {
        console.log(datos.data.id);
        agregarMisGifo(datos.data.id);
        recorder.reset();
        recorder.destroy();
        recorder = null;

        img_subirgifo.srcset = 'images/check.svg';
        texto_subirgifo.innerHTML = "GIFO subido con éxito";
        cargarInfoGifo(datos.data.id);
    }).catch(error => {
        console.error('Error:', error)
    });
}




async function cargarInfoGifo(idGif) {
    div_opcionesgifo.hidden = false;
    let puntoFinalGif = `https://api.giphy.com/v1/gifs/${idGif}?api_key=${APIkey}`;
    let gifInfo = await logFetch(puntoFinalGif);
    console.log(gifInfo);
    console.log(gifInfo.data.images.original.url);

    btn_link.addEventListener("click", function copiarLink() {
        var enlace = gifInfo.data.url;
        var inputTemporalLink = document.createElement("input");
        inputTemporalLink.setAttribute("value", enlace);
        document.body.appendChild(inputTemporalLink);
        inputTemporalLink.select();
        document.execCommand("copy");
        document.body.removeChild(inputTemporalLink);
    });

    btn_descargar.addEventListener("click", () => {
        descargarGif(gifInfo.data.images.original.url);
    });
}

/*_____________________AGREGAR MIS GIFOS GRABADOS AL LOCAL STORAGE_____________________*/
function agregarMisGifo(nuevoGifGrabadoId) {
    console.log(listado_misgifos);
    listado_misgifos.push(nuevoGifGrabadoId);
    localStorage.setItem('gifsGuardados', JSON.stringify(listado_misgifos));
}