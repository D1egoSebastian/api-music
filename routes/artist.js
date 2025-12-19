//Importar dependencias
const express = require("express")

//Cargar router
const router = express.Router()

//Importar controlador
const ArtistController = require("../controllers/artist")

//Definir rutas
router.get("/test-artist", ArtistController.test)

//Exportar

module.exports = router;