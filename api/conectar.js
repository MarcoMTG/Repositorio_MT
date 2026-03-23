import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    const clave = process.env.CLAVE_MATRIZ || "Escom_MT26"; 
    const uri = process.env.MONGODB_URI;
    const cliente = new MongoClient(uri);

    try {
        await cliente.connect();
        const db = cliente.db("sample_mflix");
        const pelicula = await db.collection("movies").findOne({});

        if (!pelicula) return res.status(404).json({ error: "No hay datos" });

        // Matriz A (2x2) desde la clave oculta
        const a = clave.charCodeAt(0), b = clave.charCodeAt(1);
        const c = clave.charCodeAt(2), d = clave.charCodeAt(3);

        let titulo = pelicula.title;
        if (titulo.length % 2 !== 0) titulo += " "; 

        let cifrado = [];
        for (let i = 0; i < titulo.length; i += 2) {
            const p1 = titulo.charCodeAt(i);
            const p2 = titulo.charCodeAt(i + 1);
            cifrado.push(a * p1 + b * p2);
            cifrado.push(c * p1 + d * p2);
        }

        res.status(200).json({ usuario: "Admin_MT", paquete: cifrado });
    } catch (e) {
        res.status(500).json({ error: e.message });
    } finally {
        await cliente.close();
    }
}
