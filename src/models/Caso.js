// models/Caso.js
const mongoose = require('mongoose');

const CasoSchema = new mongoose.Schema({
  id_caso: {
    type: Number,
    unique: true
    // Removemos o "required: true" daqui já que vamos preenchê-lo automaticamente
  },
  titulo_caso: {
    type: String,
    required: true,
    trim: true
  },
  responsavel_caso: {
    type: String,
    required: true,
    trim: true
  },
  processo_caso: {
    type: String,
    trim: true
  },
  data_abertura_caso: {
    type: Date,
    default: Date.now
  },
  descricao_caso: {
    type: String,
    trim: true
  },
  status_caso: {
    type: String,
    enum: ['Em andamento', 'Arquivado', 'Finalizado'],
    default: 'Em andamento'
  },
  data_criacao: {
    type: Date,
    default: Date.now
  },
  data_atualizacao: {
    type: Date,
    default: Date.now
  }
});

// Middleware pre-save para auto incrementar o id_caso
CasoSchema.pre('save', async function(next) {
  try {
    // Só precisamos definir id_caso se ainda não estiver definido
    if (!this.id_caso) {
      const ultimoCaso = await this.constructor.findOne().sort({ id_caso: -1 });
      this.id_caso = ultimoCaso ? ultimoCaso.id_caso + 1 : 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Atualizar data_atualizacao sempre que o documento for modificado
CasoSchema.pre('findOneAndUpdate', function(next) {
  this.set({ data_atualizacao: Date.now() });
  next();
});

module.exports = mongoose.model('Caso', CasoSchema);