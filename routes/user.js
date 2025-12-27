//Importar dependencias
const express = require("express")

//Cargar router
const router = express.Router()

//Importar controlador
const UserController = require("../controllers/user")

//Definir rutas
router.get("/test-user", UserController.test)
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/profile/:id", UserController.profile);

//Exportar

module.exports = router;