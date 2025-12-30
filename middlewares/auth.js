//importar modulos
const jwt = require ("jwt-simple");
const {secret} = require ("../helpers/jwt")
const moment = require("moment");


//crear middleware (metodo o funcion)
exports.auth = async (req, res, next) => {
    //comprobar si llega la cabecera auth
    if(!req.headers.authorization){ //la parte de postman donde se coloca authorization donde se pone el token del usuario
        return res.status(403).send({
            status: "error",
            message: "la peticion no tiene el token."
        })

    }
    //limpiar token
    let token = req.headers.authorization.replace(/['"]+/g, "")

    try{
    //decodificar token
    let payload = jwt.decode(token, secret)
    //comprobar exp del token
    if(payload.exp <= moment().unix()){
        return res.status(403).send({
            status: "error",
            message: "token invalido.",
            error: e
        })
    }

    //agregar datos del usuario a la request
    req.user = payload

    
    }catch(e){
        return res.status(403).send({
            status: "error",
            message: "token invalido.",
            error: e
        })
    }

    //pasar a la ejeccion de la accion
    next();

}

