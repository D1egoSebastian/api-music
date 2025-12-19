const validator = require("validator");

const validate = (params) => {

    let resultado = false;

    let name = !validator.isEmpty(params.name) && 
    validator.isLength(params.name, {min: 3, max: undefined})
    validator.isAlpha(params.name, "es-ES")

    let nick = !validator.isEmpty(params.nick) && 
    validator.isLength(params.name, {min: 2, max: 60})

    let email = !validator.isEmpty(params.email) && 
    validator.isEmail(params.email)

    let password = !validator.isEmpty(params.password)

    if(params.surname){
        !validator.isEmpty(params.surname) && 
        validator.isLength(params.surname, {min: 3, max: undefined})
        validator.isAlpha(params.surname, "es-ES")

        if(!surname){
            throw new Error("no es valido")
            resultado = false
        } else {
            console.log("validacion superada en el surname")
            resultado = true
        }
    }

    if(!name || !nick || !email || !password){
        throw new Error("no se ha superado la validacion")
        resultado = false
    } else {
        console.log("datos validados.")
        resultado = true;
    }
}


module.exports = validate