const express = require('express');
const router = express.Router();
const { getLugares, createLugar, getPredios, createPredio, deletePredio, getLotesByPredio, createLote, getCultivos } = require('../controllers/predial.controller');

router.get('/lugares', getLugares);
router.post('/lugares', createLugar);
router.get('/predios', getPredios);
router.post('/predios', createPredio);
router.delete('/predios/:id', deletePredio);
router.get('/lotes/predio/:id', getLotesByPredio);
router.post('/lotes', createLote);
router.get('/cultivos', getCultivos);

module.exports = router;