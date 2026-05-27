const express = require('express');
const router = express.Router();
const { getLugares, createLugar, getPredios, createPredio, deletePredio, 
        getLotesByPredio, createLote, getCultivos, getPrediosConRiesgo } = require('../controllers/predial.controller');

router.get('/lugares', getLugares);
router.post('/lugares', createLugar);
router.get('/predios', getPredios);
router.post('/predios', createPredio);
router.delete('/predios/:id', deletePredio);
router.get('/lotes/predio/:id', getLotesByPredio);
router.post('/lotes', createLote);
router.get('/cultivos', getCultivos);
router.get('/predios/riesgo', getPrediosConRiesgo); 

module.exports = router;