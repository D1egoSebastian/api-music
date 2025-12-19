

const test = async (req, res) => {
        try{
        return res.status(200).send({
            status: "success",
            message: "ruta de prueba en controllers/user.js"
        })
    }catch(e){
        throw new Error("No se pudo conectar a la ruta de prueba.")
    }
}

module.exports = {
    test
}