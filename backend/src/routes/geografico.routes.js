const express = require('express');
const router = express.Router();
const { getDepartamentos, createDepartamento, getMunicipios, getMunicipiosByDepartamento, createMunicipio } = require('../controllers/geografico.controller');

router.get('/departamentos', getDepartamentos);
router.post('/departamentos', createDepartamento);
router.get('/municipios', getMunicipios);
router.get('/municipios/departamento/:id', getMunicipiosByDepartamento);
router.post('/municipios', createMunicipio);

module.exports = router;