import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    const clave = process.env.CLAVE_MATRIZ || "Escom_MT26"; 
    const cliente = new MongoClient(process.env.MONGODB_URI);

    try {
        await cliente.connect();
        // Traemos las primeras 15 películas
        const peliculas = await cliente.db("sample_mflix").collection("movies").find({}).limit(15).toArray();

        const a = clave.charCodeAt(0), b = clave.charCodeAt(1);
        const c = clave.charCodeAt(2), d = clave.charCodeAt(3);

        // Encriptamos cada película de la lista
        const listaCifrada = peliculas.map(p => {
            let titulo = p.title;
            if (titulo.length % 2 !== 0) titulo += " "; 
            let cifrado = [];
            for (let i = 0; i < titulo.length; i += 2) {
                const p1 = titulo.charCodeAt(i);
                const p2 = titulo.charCodeAt(i + 1);
                cifrado.push(a * p1 + b * p2);
                cifrado.push(c * p1 + d * p2);
            }
            return cifrado;
        });

        res.status(200).json({ usuario: "Admin_MT", catalogo: listaCifrada });
    } catch (e) {
        res.status(500).json({ error: e.message });
    } finally {
        await cliente.close();
    }
}
