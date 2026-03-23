import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    // Jalamos la clave desde la "Caja Fuerte" de Vercel (Paso 1)
    const passBackend = process.env.CLAVE_MATRIZ;
    const cliente = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await cliente.connect();
        const db = cliente.db("sample_mflix");
        const pelicula = await db.collection("movies").findOne({});
        
        // Encriptamos antes de mandar el dato a la web
        const fA = passBackend.charCodeAt(0);
        const fB = passBackend.length;
        
        let cifrado = pelicula.title.split('').map(char => {
            return (char.charCodeAt(0) * fA) + fB;
        });

        res.status(200).json({ 
            mensaje: "Datos Cifrados con Matriz",
            datosCifrados: cifrado 
        });
    } catch (e) {
        res.status(500).json({ error: "Fallo de conexión" });
    } finally {
        await cliente.close();
    }
}
