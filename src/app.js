// app.js ou src/app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importando as rotas
const usuarioRoutes = require('./routes/usuario');
const authRoutes = require('./routes/auth');
const casoRoutes = require('./routes/caso');

// Conectando ao banco de dados
const connectDB = require('./config/db');
connectDB();

// Inicializando o app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/casos', casoRoutes);

// Porta do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});