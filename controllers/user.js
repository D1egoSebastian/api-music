//imports
const validate = require("../helpers/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwtService = require("../helpers/jwt")


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
                                    .select("+password +role");

        if(!userToFind){
            return res.status(400).send({
                status: "error",
                message: "No existe este usuario."
            })
        }

        //comprobar su contra
        const checkPassword = await bcrypt.compare(params.password, userToFind.password)
        if(!checkPassword){
            return res.status(400).send({
                status: "error",
                message: "usuario o contra invalidos"
            })
        }

        userToFind.password = undefined

        //Conseguir token jwt (crear servicio token)
        const token = jwtService.createToken(userToFind)

        // Devolver datos usuario y token
        return res.status(200).send({
            status: "success",
            message: "metodo de Login",
            user: userToFind,
            token
        })
    }catch (e) {
    return res.status(500).send({
        status: "error",
        message: "Error interno del servidor",
        error: e.message
    });
}

}

const profile = async (req, res) => {
    try{

        //recoger id del usuario url
        let id = req.params.id;
        //consulta para sacar datos del perfil
        let userFind = await User.findById(id);

        if(!userFind){
            return res.status(400).send({
                status: "error",
                message: "usuario invalido o no existe."
            })
        }
        //devolver res
        return res.status(200).send({
            status: "success",
            message: "metodo de profile",
            id,
            user: userFind
        })
    }catch (e) {
    return res.status(500).send({
        status: "error",
        message: "Error interno del servidor",
        error: e.message
    });
}
}

const update = async (req, res) => {

    try{
        //recoger datos del usuario identificado
        const userIdentity = req.user;
        //recoger datos a actualizar
        const userToUpdate = req.body

        try{
            validate(userToUpdate)
        }catch(e){
            return res.status(400).send({
                    status: "error",
                    message: "validacion no superada"
                });
        }

        //comprobar si existe
        const userToFind = await User.find({
            $or: [
                {email: userToUpdate.email?.toLowerCase()},
                {nick: userToUpdate.nick?.toLowerCase()}
            ]
        })

        //comprobar si el usuario existe y no soy yo(el identificado)
        let userIsset = false;

        userToFind.forEach(user => {
            if(user && user.id != userIdentity.id) {
                userIsset = true;
            }
        });

        if(userIsset){
            return res.status(400).send({
                status: "error",
                message: "El usuario ya existe."
            })
        }

        //Cifrar password si llega
        if(userToUpdate.password){
            const crypt = await bcrypt.hash(userToUpdate.password, 10)
            userToUpdate.password = crypt
        } else {
            delete userToUpdate.password;
        }

        //buscar usuario en bd y actualizar datos
        try{
            const userUpdated = await User.findByIdAndUpdate(
                userIdentity.id,
                userToUpdate,
                {new: true} // options con esto le aclaramos que se hagan cambios new
            );

            userUpdated.password = undefined;

            if(!userUpdated){
                return res.status(400).send({
                status: "error",
                message: "Error al actualizar."
                })
            }

            return res.status(200).send({
                        status: "success",
                        message: "metodo de update",
                        usuarioEditado: userUpdated
                    })
        }catch(e){
            return res.status(400).send({
                status: "error",
                message: "Error al actualizar."
                })
        }

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
    login,
    profile,
    update
}