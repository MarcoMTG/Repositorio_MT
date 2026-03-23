import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    // Jalamos la clave desde la configuración OCULTA de Vercel
    const clave = process.env.CLAVE_MATRIZ; 
    const cliente = new MongoClient(process.env.MONGODB_URI);

    try {
        await cliente.connect();
        const pelicula = await cliente.db("sample_mflix").collection("movies").findOne({});
        
        // Creamos la matriz A (2x2) usando los ASCII de la clave oculta
        const A = [
            [clave.charCodeAt(0), clave.charCodeAt(1)],
            [clave.charCodeAt(2), clave.charCodeAt(3)]
        ];

        let titulo = pelicula.title;
        if (titulo.length % 2 !== 0) titulo += " "; // Padding

        let cifrado = [];
        for (let i = 0; i < titulo.length; i += 2) {
            const P = [titulo.charCodeAt(i), titulo.charCodeAt(i + 1)];
            // C = A * P
            cifrado.push(A[0][0] * P[0] + A[0][1] * P[1]);
            cifrado.push(A[1][0] * P[0] + A[1][1] * P[1]);
        }

        res.status(200).json({ usuario: "Admin_MT", paquete: cifrado });
    } catch (e) {
        res.status(500).json({ error: "Error de servidor" });
    } finally { await cliente.close(); }
}
