//Importar dependencias
const express = require("express")
const check = require("../middlewares/auth")

//Cargar router
const router = express.Router()

//Importar controlador
const UserController = require("../controllers/user")

//Definir rutas
router.get("/test-user", UserController.test)
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/profile/:id", check.auth, UserController.profile);
router.put("/update", check.auth, UserController.update)

//Exportar

module.exports = router;