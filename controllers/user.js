//imports
const validate = require("../helpers/validator")
const User = require("../models/user");
const bycrpt = require("bcrypt");

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
        const userDuplicated = await User.find({
            $or: [
                {email: params.email.tolowerCase()},
                {nick: params.nick.tolowerCase()}
            ]
        })

        if(!userDuplicated || userDuplicated.length >=1){
            return res.status(400).send({
                status: "error",
                message: "Usuario duplicado"
            })
        }


        //cifrar la contra
        try{
            const hashedPassword = await bycrpt.hash(params.password, 10);
            params.password = hashedPassword;
        }catch(e){
            return res.status(500).send({
                status: "error",
                message: "Error al cifrar la contraseña"
            })
        }
        

        //crear objeto del usuario
        let userToSave = new User(params);

        //guardar usuario en la db
        let UserSave = await userToSave.save();

        if(!UserSave){
            return res.status(500).send({
                status: "error",
                message: "Error al guardar el usuario"
            })
        }

        //limpiar objeto a devolver
        return res.status(200).send({
            status: "success",
            message: "Usuario registrado correctamente",
            user: UserSave
        })

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