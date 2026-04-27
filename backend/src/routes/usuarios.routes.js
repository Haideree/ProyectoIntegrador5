const express = require('express');
const router = express.Router();
const { getUsuarios, getUsuarioById, createUsuario, loginUsuario, deleteUsuario } = require('../controllers/usuarios.controller');

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.post('/login', loginUsuario);
router.delete('/:id', deleteUsuario);

module.exports = router;
