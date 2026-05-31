const express = require('express');
const router = express.Router();
const { getUsuarios, getUsuarioById, createUsuario, loginUsuario, deleteUsuario, updateUsuario, createUsuarioConRol } = require('../controllers/usuarios.controller');

router.get('/', getUsuarios);
router.post('/login', loginUsuario);
router.post('/crear-con-rol', createUsuarioConRol);
router.post('/', createUsuario);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

module.exports = router;