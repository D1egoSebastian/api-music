//imports
const validate = require("../helpers/validator")

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

//Controlador de registro
const register = async (req, res) => {

    try{

        //recoger datos
        let params = req.body;
        console.log(params)
        //comprobar que llegan bien
        if(!params.name || !params.nick || !params.email || !params.password){
            return res.status(400).send({
                status: "error",
                message: "Faltan datos o datos son invalidos"
            })
        }
        //validar datos
        try{
            validate(params)
        }catch(e){
            return res.status(400).send({
                    status: "error",
                    message: "validacion no superada"
                });
        }
        

        //control de usuarios duplicados

        //cifrar la contra

        //crear objeto del usuario

        //guardar usuario en la db

        //limpiar objeto a devolver

        //devolver res
        return res.status(200).send({
        status: "success",
        message: "metodo del registro",
        params
    })
    }catch(e){
        throw new Error("No se pudo conectar a la ruta de prueba.")
    }
    
}

module.exports = {
    test,
    register
}