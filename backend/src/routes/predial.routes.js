const express = require("express");
const router  = express.Router();
const {
    getLugares, getLugarById, createLugar, updateLugar, deleteLugar,
    getPredios, getPredioById, createPredio, updatePredio, deletePredio,
    getLotesByLugarProduccion, getLotesByPredio, getLoteById, createLote, updateLote, deleteLote,
    getCultivos, getPrediosConRiesgo,
    getProductores, getProductorById, createProductor, updateProductor, deleteProductor,
} = require("../controllers/predial.controller");

// Lugares
router.get("/lugares",        getLugares);
router.get("/lugares/:id",    getLugarById);
router.post("/lugares",       createLugar);
router.put("/lugares/:id",    updateLugar);
router.delete("/lugares/:id", deleteLugar);

// Predios — /predios/riesgo ANTES de /predios/:id
router.get("/predios/riesgo", getPrediosConRiesgo);
router.get("/predios",        getPredios);
router.get("/predios/:id",    getPredioById);
router.post("/predios",       createPredio);
router.put("/predios/:id",    updatePredio);
router.delete("/predios/:id", deletePredio);

// Lotes — rutas específicas ANTES de /:id
router.get("/lotes/lugar/:id",  getLotesByLugarProduccion);
router.get("/lotes/predio/:id", getLotesByPredio);
router.get("/lotes/:id",        getLoteById);
router.post("/lotes",           createLote);
router.put("/lotes/:id",        updateLote);
router.delete("/lotes/:id",     deleteLote);

// Cultivos
router.get("/cultivos", getCultivos);

// Productores
router.get("/productores",        getProductores);
router.get("/productores/:id",    getProductorById);
router.post("/productores",       createProductor);
router.put("/productores/:id",    updateProductor);
router.delete("/productores/:id", deleteProductor);

module.exports = router;