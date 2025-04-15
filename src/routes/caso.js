// src/routes/caso.js
const express = require('express');
const router = express.Router();
const casoController = require('../controllers/casoController');

// Rotas sem verificação de token por enquanto
router.get('/', casoController.buscarTodos);
router.get('/status/:status', casoController.buscarPorStatus);
router.get('/:id', casoController.buscarPorId);
router.post('/', casoController.criar);
router.put('/:id', casoController.atualizar);
router.delete('/:id', casoController.excluir);

module.exports = router;