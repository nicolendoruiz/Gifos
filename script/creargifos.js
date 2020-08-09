let stream, recorder, blob, info;
let div_descripcion = document.getElementById('div-descripcion');
let btn_iniciar = document.getElementById('btn-comenzar');
let btn_grabar = document.getElementById('btn-grabar');
let btn_finalizar = document.getElementById('btn-finalizar');
let btn_subir = document.getElementById('btn-subir');
let img_gif = document.getElementById('gif-grabado');
let pasos = document.getElementsByClassName('paso');

btn_iniciar.addEventListener("click", () => {
    iniciarPermisosGrabacion();
    iniciarVisual();
});

btn_grabar.addEventListener("click", () => {
    iniciarGrabacion();
});

btn_finalizar.addEventListener("click", pararGrabacion);

btn_subir.addEventListener('click', async () => {
    pasos[1].classList.remove('pasoactivo');
    pasos[2].classList.add('pasoactivo');
    subirGifGrabado();
})

function iniciarVisual() {
    div_descripcion.innerHTML = "<h2>¿Nos das acceso </br> a tu cámara?</h2><p>El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.</p>";
    btn_iniciar.hidden = true;
    btn_grabar.hidden = false;
    pasos[0].classList.add('pasoactivo');
}
function iniciarPermisosGrabacion() {
    var constraints = { audio: false, video: { width: 480, height: 320 } }; //opciones de video
    navigator.mediaDevices.getUserMedia(constraints)//permisos para la captura de vídeo
        .then(function (stream) {
            recorder = RecordRTC(stream, {
                type: 'gif'
            });
            var video = document.querySelector('video');
            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play(); //grabar en el contenedor de vídeo
            }
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
    pasos[0].classList.remove('pasoactivo');
    pasos[1].classList.add('pasoactivo');
}

function pararGrabacion() {
    recorder.stopRecording(function () {
        blob = recorder.getBlob();
        info = recorder.getBlob();
        img_gif.src = URL.createObjectURL(blob);
        recorder.reset();
        recorder.destroy();
        recorder = null;
        console.log(blob);
        btn_subir.hidden = false;
        btn_finalizar.hidden = true;
    });
}

function subirGifGrabado() {
    let form = new FormData();
    form.append('file', info, 'myGif.gif');
    console.log(form.get('file'));
    fetch(`https://upload.giphy.com/v1/gifs?api_key=${APIkey}`, {
        method: 'POST',
        body: form, 
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
}
