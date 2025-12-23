//imports
const validate = require("../helpers/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");


const test = async (req, res) => {
        try{
        return res.status(200).send({
            status: "success",
            message: "ruta de prueba en controllers/user.js"
        })
    }catch (e) {
    return res.status(500).send({
        status: "error",
        message: "Error interno del servidor",
        error: e.message
    });
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
                {email: params.email.toLowerCase()},
                {nick: params.nick.toLowerCase()}
            ]
        })

        if(userDuplicated.length >=1){
            return res.status(400).send({
                status: "error",
                message: "Usuario duplicado o ya existe"
            })
        }


        //cifrar la contra
        try{
            const hashedPassword = await bcrypt.hash(params.password, 10);
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

        UserSave.password = undefined

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
    }catch (e) {
    return res.status(500).send({
        status: "error",
        message: "Error interno del servidor",
        error: e.message
    });
}

    
}

const login = async (req, res) => {
    try{

        //recoger parametros
        let params = req.body;
        //comprobar que llegan
        if(!params.email || !params.password){
            return res.status(400).send({
                status: "error",
                message: "parametros invalidos o faltan datos por enviar."
            })
        }

        //buscar en la db si existe el usuario
        let userToFind = await User.findOne({email: params.email.toLowerCase()})
                                    .select("+password");

        if(!userToFind){
            return res.status(400).send({
                status: "error",
                message: "No existe este usuario."
            })
        }

        //comprobar su contra
        const checkPassword = await bcrypt.compareSync(params.password, userToFind.password)
        if(!checkPassword){
            return res.status(400).send({
                status: "error",
                message: "usuario o contra invalidos"
            })
        }

        userToFind.password = undefined

        //Conseguir token jwt (crear servicio token)

        // Devolver datos usuario y token
        return res.status(200).send({
            status: "success",
            message: "metodo de Login",
            user: userToFind
        })
    }catch (e) {
    return res.status(500).send({
        status: "error",
        message: "Error interno del servidor",
        error: e.message
    });
}

}

module.exports = {
    test,
    register,
    login
}