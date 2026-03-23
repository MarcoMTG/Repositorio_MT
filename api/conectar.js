import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    const cliente = new MongoClient(process.env.MONGODB_URI);
    try {
        await cliente.connect();
        const db = cliente.db("sample_mflix");
        const coleccion = db.collection("movies");
        
        // Buscamos la película de la foto que me mandaste
        const pelicula = await coleccion.findOne({});
        
        res.status(200).json({ 
            mensaje: "¡Conexión Exitosa!",
            titulo: pelicula.title
        });
    } catch (e) {
        res.status(500).json({ error: "Error de conexión" });
    } finally {
        await cliente.close();
    }
}
