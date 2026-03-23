const boton = document.getElementById('btnEjecutar');
const caja = document.getElementById('resultado');

boton.addEventListener('click', async () => {
    const passInput = document.getElementById('claveUsuario').value;
    
    if (!passInput) {
        alert("¡Introduce la clave de la ESCOM!");
        return;
    }

    caja.innerHTML = "Consultando base de datos...";

    try {
        const res = await fetch('/api/conectar');
        const data = await res.json();
        
        // --- DESENCRIPTACIÓN POR MATRICES ---
        const fA = passInput.charCodeAt(0);
        const fB = passInput.length;

        let tituloReal = data.datosCifrados.map(num => {
            return String.fromCharCode((num - fB) / fA);
        }).join('');

        // Mostramos el Usuario y el Resultado
        caja.innerHTML = `
            <div style="border: 1px solid #444; padding: 15px; border-radius: 10px; background: #1e1e1e;">
                <p style="color: #0070f3;">👤 Usuario: <strong>${data.usuario}</strong></p>
                <p style="color: #00ff00;">✅ Estado: ${data.mensaje}</p>
                <hr style="border: 0.5px solid #333;">
                <p>🎬 Película: <span style="font-size: 1.2em; color: white;">${tituloReal}</span></p>
            </div>
        `;
    } catch (err) {
        caja.innerHTML = "<p style='color:red;'>Error de conexión. Revisa los Logs en Vercel.</p>";
    }
});
