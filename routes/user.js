//Importar dependencias
const express = require("express")

//Cargar router
const router = express.Router()

//Importar controlador
const UserController = require("../controllers/user")

//Definir rutas
router.get("/test-user", UserController.test)
router.post("/register", UserController.register)

//Exportar

module.exports = router;