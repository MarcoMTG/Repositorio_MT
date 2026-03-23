boton.addEventListener('click', async () => {
    // Leemos lo que TÚ escribas físicamente en la pantalla
    const pass = document.getElementById('claveUsuario').value;
    if (pass.length < 4) return alert("Escribe la clave de 4+ caracteres");

    try {
        const res = await fetch('/api/conectar');
        const data = await res.json();

        // 1. Generamos la matriz A con lo que escribiste
        const a = pass.charCodeAt(0), b = pass.charCodeAt(1);
        const c = pass.charCodeAt(2), d = pass.charCodeAt(3);

        // 2. Calculamos el Determinante para la Inversa
        const det = (a * d) - (b * c);
        if (det === 0) return alert("Error matemático: Clave no válida");

        // 3. Aplicamos la Matriz Inversa: P = A^-1 * C
        let tituloReal = "";
        for (let i = 0; i < data.paquete.length; i += 2) {
            const C1 = data.paquete[i];
            const C2 = data.paquete[i+1];

            const P1 = (d * C1 - b * C2) / det;
            const P2 = (-c * C1 + a * C2) / det;

            tituloReal += String.fromCharCode(Math.round(P1)) + String.fromCharCode(Math.round(P2));
        }

        caja.innerHTML = `<strong>Usuario:</strong> ${data.usuario} <br> <strong>Película:</strong> ${tituloReal.trim()}`;
    } catch (err) { caja.innerHTML = "Error de conexión"; }
});
