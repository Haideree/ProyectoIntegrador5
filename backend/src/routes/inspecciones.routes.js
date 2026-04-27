const express = require('express');
const router = express.Router();
const { 
  getSolicitudes, getSolicitudById, createSolicitud, updateSolicitudEstado, 
  getInspecciones, createInspeccion, getInspeccionesByTecnico, updateInspeccion, 
  getLotesByPredio, getSolicitudesCompletas,
  getPrediosByProductor, getSolicitudesByProductor
} = require('../controllers/inspecciones.controller');

router.get('/solicitudes', getSolicitudes);
router.get('/solicitudes/completas', getSolicitudesCompletas);
router.get('/solicitudes/productor/:productor_id', getSolicitudesByProductor);
router.get('/solicitudes/mis/:productor_id', getSolicitudesByProductor);
router.get('/solicitudes/:id', getSolicitudById);
router.post('/solicitudes', createSolicitud);
router.post('/solicitudes/nueva', createSolicitud);
router.patch('/solicitudes/:id/estado', updateSolicitudEstado);
router.get('/inspecciones/tecnico/:tecnico_id', getInspeccionesByTecnico);
router.get('/inspecciones', getInspecciones);
router.post('/inspecciones', createInspeccion);
router.patch('/inspecciones/:id', updateInspeccion);
router.get('/lotes/predio/:predio_id', getLotesByPredio);
router.get('/predios/productor/:productor_id', getPrediosByProductor);

module.exports = router;