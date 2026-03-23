const boton = document.getElementById('btnConectar');
const caja = document.getElementById('resultado');

boton.addEventListener('click', async () => {
    caja.innerHTML = "Llamando a la API...";
    try {
        // Esto busca la carpeta secreta que haremos después
        const res = await fetch('/api/conectar');
        const data = await res.json();
        caja.innerHTML = "Mensaje del servidor: " + data.mensaje;
    } catch (err) {
        caja.innerHTML = "Error al conectar.";
    }
});
