import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    // 1. Usamos la URI que ya configuraste en Vercel (con Admin_MT)
    const uri = process.env.MONGODB_URI;
    const cliente = new MongoClient(uri);

    // 2. Usamos tu contraseña de la ESCOM como "semilla" para la matriz
    // Esta debe ser la misma que guardaste en Vercel como CLAVE_MATRIZ
    const claveSecreta = process.env.CLAVE_MATRIZ || "Escom_MT26";

    try {
        await cliente.connect();
        
        // 3. Conectamos a la base de datos de tu foto
        const db = cliente.db("sample_mflix");
        const coleccion = db.collection("movies");

        // 4. Buscamos una película real
        const pelicula = await coleccion.findOne({});

        if (!pelicula) {
            return res.status(404).json({ error: "No se encontraron películas" });
        }

        // --- LÓGICA DE MATRICES (ENCRIPTACIÓN) ---
        const factorA = claveSecreta.charCodeAt(0); // ASCII de 'E'
        const factorB = claveSecreta.length;        // 10

        // Encriptamos el título antes de enviarlo al iPad
        const tituloEncriptado = pelicula.title.split('').map(char => {
            return (char.charCodeAt(0) * factorA) + factorB;
        });

        // 5. Enviamos la respuesta segura
        res.status(200).json({
            mensaje: "¡Conexión Exitosa desde el Cluster-MT!",
            datosCifrados: tituloEncriptado
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error de conexión: " + e.message });
    } finally {
        await cliente.close();
    }
}
