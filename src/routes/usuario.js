const express = require('express');
const router = express.Router();
const {
  cadastrarUsuario,
  listarUsuarios,
  obterUsuario,
  atualizarUsuario,
  excluirUsuario
} = require('../controllers/usuarioController');

// Rotas de usuários
router.post('/', cadastrarUsuario);
router.get('/', listarUsuarios);
router.get('/:id', obterUsuario);
router.put('/:id', atualizarUsuario);
router.delete('/:id', excluirUsuario);

module.exports = router;