//importar mongoose
const mongoose = require("mongoose")
mongoose.set("strictQuery", true);

//metodo de conexion
const connection = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/app_musica");
        console.log("conectado a la db: app_musica");
    }catch(e){
        console.log(e)
        throw new Error("no se pudo conectar al db.")
    }
    
}
//exportar conexion
module.exports = connection;