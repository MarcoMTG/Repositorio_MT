boton.addEventListener('click', async () => {
    const pass = document.getElementById('claveUsuario').value;
    if (pass.length < 4) return alert("Clave de 4+ caracteres");

    caja.innerHTML = "🔓 Desencriptando catálogo completo...";

    try {
        const respuesta = await fetch('/api/conectar');
        const data = await respuesta.json();

        const a = pass.charCodeAt(0), b = pass.charCodeAt(1);
        const c = pass.charCodeAt(2), d = pass.charCodeAt(3);
        const det = (a * d) - (b * c);

        let htmlFinal = `<p style="color: #0070f3;">👤 Usuario: ${data.usuario}</p><hr>`;
        
        // Desencriptamos cada película del arreglo
        data.catalogo.forEach((cifrado, index) => {
            let tituloReal = "";
            for (let i = 0; i < cifrado.length; i += 2) {
                const p1 = (d * cifrado[i] - b * cifrado[i+1]) / det;
                const p2 = (-c * cifrado[i] + a * cifrado[i+1]) / det;
                tituloReal += String.fromCharCode(Math.round(p1)) + String.fromCharCode(Math.round(p2));
            }
            htmlFinal += `<p style="color: #00ff00;">🎬 ${index + 1}. ${tituloReal.trim()}</p>`;
        });

        caja.innerHTML = htmlFinal;

    } catch (err) {
        caja.innerHTML = "❌ Error al cargar la tabla.";
    }
});
