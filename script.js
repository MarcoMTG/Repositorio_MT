const boton = document.getElementById('btnEjecutar');
const caja = document.getElementById('resultado');

boton.addEventListener('click', async () => {
    const pass = document.getElementById('claveUsuario').value;
    
    if (pass.length < 4) {
        alert("La clave debe tener al menos 4 caracteres");
        return;
    }

    caja.innerHTML = "📡 Conectando con MongoDB y aplicando Inversa...";

    try {
        const respuesta = await fetch('/api/conectar');
        const data = await respuesta.json();

        if (data.error) {
            caja.innerHTML = "❌ Error: " + data.error;
            return;
        }

        // 1. Matriz desde lo que TÚ escribiste
        const a = pass.charCodeAt(0), b = pass.charCodeAt(1);
        const c = pass.charCodeAt(2), d = pass.charCodeAt(3);

        // 2. Determinante para la Inversa
        const det = (a * d) - (b * c);
        if (det === 0) {
            caja.innerHTML = "❌ Error: Clave no válida matemáticamente.";
            return;
        }

        // 3. Desencriptar usando la Inversa (P = A^-1 * C)
        let tituloReal = "";
        for (let i = 0; i < data.paquete.length; i += 2) {
            const c1 = data.paquete[i];
            const c2 = data.paquete[i+1];

            const p1 = (d * c1 - b * c2) / det;
            const p2 = (-c * c1 + a * c2) / det;

            tituloReal += String.fromCharCode(Math.round(p1)) + String.fromCharCode(Math.round(p2));
        }

        caja.innerHTML = `
            <p style="color: #0070f3;">👤 Usuario: ${data.usuario}</p>
            <p style="color: #00ff00;">🎬 Película: <strong>${tituloReal.trim()}</strong></p>
        `;

    } catch (err) {
        console.error(err);
        caja.innerHTML = "❌ Error crítico: Revisa tu conexión a internet.";
    }
});
