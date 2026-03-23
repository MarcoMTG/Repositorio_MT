import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    // 1. Jalamos la URI y la Clave desde las Variables de Entorno de Vercel
    // Así NO aparecen escritas aquí en GitHub y tu proyecto es seguro.
    const uri = process.env.MONGODB_URI;
    const claveSecreta = process.env.CLAVE_MATRIZ; 

    const cliente = new MongoClient(uri);

    try {
        await cliente.connect();
        
        // 2. Entramos a la base de datos 'sample_mflix' de tu Atlas
        const db = cliente.db("sample_mflix");
        const coleccion = db.collection("movies");

        // 3. Buscamos la película (puedes usar .find().limit(5).toArray() si quieres más)
        const pelicula = await coleccion.findOne({});

        if (!pelicula) {
            return res.status(404).json({ error: "No se encontraron datos." });
        }

        // --- LÓGICA DE MATRICES (ENCRIPTACIÓN) ---
        // Usamos los valores ASCII de tu clave secreta guardada en Vercel
        const fA = claveSecreta.charCodeAt(0); // ASCII de la primera letra
        const fB = claveSecreta.length;        // Longitud de la clave

        // Convertimos el título a una lista de números encriptados
        const tituloCifrado = pelicula.title.split('').map(char => {
            return (char.charCodeAt(0) * fA) + fB;
        });

        // 4. Enviamos la respuesta segura al Frontend
        res.status(200).json({
            mensaje: "¡Conexión Segura al Cluster-MT!",
            datosCifrados: tituloCifrado
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error de servidor: " + e.message });
    } finally {
        // Cerramos la conexión para no saturar tu clúster gratuito
        await cliente.close();
    }
}
