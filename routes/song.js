//Importar dependencias
const express = require("express")

//Cargar router
const router = express.Router()

//Importar controlador
const SongController = require("../controllers/song")

//Definir rutas
router.get("/test-song", SongController.test)

//Exportar

module.exports = router;