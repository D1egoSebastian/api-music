//Importar conexion a base de datos
const connection = require ("../api-rest-musica/database/connection");

//Importar dependencias
const express = require("express");
const cors = require("cors");


console.log("API Rest with node for music app!")
//Ejecutar conexion de la db
connection();

//Crear servidor de node
const app = express();
const port = 3910;

//Configurar cors
app.use(cors())

//Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Cargar configuracion de rutas
const UserRoutes = require("./routes/user")
const ArtistRoutes = require("./routes/artist")
const AlbumRoutes = require("./routes/album")
const SongRoutes = require("./routes/song")

app.use("/api/user", UserRoutes)
app.use("/api/artist", ArtistRoutes)
app.use("/api/album", AlbumRoutes)
app.use("/api/song", SongRoutes)


//Ruta de prueba
app.get("/ruta-testing", async (req, res) => {
    try{
        return res.status(200).send({
            status: "success",
            message: "ruta de prueba"
        })
    }catch(e){
        throw new Error("No se pudo conectar a la ruta de prueba.")
    }
})

//Poner server en listen peticiones http
app.listen(port, () => {
    console.log("server is on listening!", port)
})