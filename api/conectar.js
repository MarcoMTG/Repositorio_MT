import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    // Jalamos las llaves desde la "Caja Fuerte" de Vercel
    const uri = process.env.MONGODB_URI;
    const claveSecreta = process.env.CLAVE_MATRIZ; 

    const cliente = new MongoClient(uri);

    try {
        await cliente.connect();
        const db = cliente.db("sample_mflix");
        const coleccion = db.collection("movies");

        // Buscamos la primera película de la lista
        const pelicula = await coleccion.findOne({});

        if (!pelicula) {
            return res.status(404).json({ error: "Sin datos" });
        }

        // --- ENCRIPTACIÓN POR MATRICES ---
        const fA = claveSecreta.charCodeAt(0); 
        const fB = claveSecreta.length;

        const tituloCifrado = pelicula.title.split('').map(char => {
            return (char.charCodeAt(0) * fA) + fB;
        });

        // Enviamos el nombre del usuario y los datos cifrados
        res.status(200).json({
            usuario: "Admin_MT", 
            mensaje: "¡Conexión Exitosa al Cluster-MT!",
            datosCifrados: tituloCifrado
        });

    } catch (e) {
        res.status(500).json({ error: "Error: " + e.message });
    } finally {
        await cliente.close();
    }
}
