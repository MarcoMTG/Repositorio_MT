const boton = document.getElementById('btnEjecutar');
const caja = document.getElementById('resultado');

boton.addEventListener('click', async () => {
    const passInput = document.getElementById('claveUsuario').value;
    
    if (!passInput) {
        alert("¡Falta la clave de la ESCOM!");
        return;
    }

    caja.innerHTML = "Llamando a la API...";

    try {
        const res = await fetch('/api/conectar');
        const data = await res.json();
        
        // --- Algoritmo de Matrices Inversas ---
        // Usamos la clave que escribiste en el iPad para desencriptar
        const fA = passInput.charCodeAt(0); // ASCII de la primera letra
        const fB = passInput.length;       // Largo de la clave

        let tituloReal = data.datosCifrados.map(num => {
            // Operación inversa matemática
            let codigoASCII = (num - fB) / fA;
            return String.fromCharCode(codigoASCII);
        }).join('');

        caja.innerHTML = `Mensaje: ${data.mensaje} <br> Título: <strong>${tituloReal}</strong>`;
    } catch (err) {
        caja.innerHTML = "Error: Revisa tu conexión o la IP en MongoDB.";
    }
});
