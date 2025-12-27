//importar dependencias
const jwt = require ("jwt-simple");
const moment = require ("moment");
//clave secreta para generar token
const secret = "CLAVE_SECRETA_DEL_API_MUSIC_12345"
//funcion de generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    //devolver token
    return jwt.encode(payload, secret)
}

//exportarlo
module.exports = {
    secret,
    createToken
}