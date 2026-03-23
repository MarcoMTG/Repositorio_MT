import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    const uri = process.env.MONGODB_URI;
    const cliente = new MongoClient(uri);
    // Usamos tu clave de la ESCOM para la matriz
    const claveSecreta = "Escom_MT26"; 

    try {
        await cliente.connect();
        // Con esto entramos a la carpeta de películas que vimos en tu Atlas
        const db = cliente.db("sample_mflix");
        const pelicula = await db.collection("movies").findOne({});

        // --- Encriptación con Matrices ---
        const fA = claveSecreta.charCodeAt(0); 
        const fB = claveSecreta.length;
        const cifrado = pelicula.title.split('').map(c => (c.charCodeAt(0) * fA) + fB);

        res.status(200).json({ datosCifrados: cifrado });
    } catch (e) {
        res.status(500).json({ error: "Error de conexión: " + e.message });
    } finally {
        await cliente.close();
    }
}
