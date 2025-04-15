// controllers/casoController.js
const Caso = require('../models/Caso');

// Buscar todos os casos
exports.buscarTodos = async (req, res) => {
  try {
    const casos = await Caso.find();
    res.status(200).json({ success: true, data: casos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Buscar caso por ID
exports.buscarPorId = async (req, res) => {
  try {
    const caso = await Caso.findOne({ id_caso: req.params.id });
    
    if (!caso) {
      return res.status(404).json({ success: false, error: 'Caso não encontrado' });
    }
    
    res.status(200).json({ success: true, data: caso });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Criar novo caso
exports.criar = async (req, res) => {
  try {
    const { 
      titulo_caso, 
      responsavel_caso,
      processo_caso,
      data_abertura_caso,
      descricao_caso,
      status_caso
    } = req.body;
    
    if (!titulo_caso || !responsavel_caso) {
      return res.status(400).json({ 
        success: false, 
        error: 'Por favor, forneça pelo menos título e responsável pelo caso' 
      });
    }
    
    // Encontrar o último id_caso para incrementá-lo
    let ultimoIdCaso = 0;
    const ultimoCaso = await Caso.findOne().sort({ id_caso: -1 });
    if (ultimoCaso) {
      ultimoIdCaso = ultimoCaso.id_caso;
    }
    
    const novoCaso = new Caso({
      id_caso: ultimoIdCaso + 1, // Define o id_caso manualmente
      titulo_caso,
      responsavel_caso,
      processo_caso,
      data_abertura_caso: data_abertura_caso || Date.now(),
      descricao_caso,
      status_caso: status_caso || 'Em andamento'
    });
    
    await novoCaso.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Caso criado com sucesso', 
      data: novoCaso 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Atualizar caso
exports.atualizar = async (req, res) => {
  try {
    const { 
      titulo_caso, 
      responsavel_caso,
      processo_caso,
      data_abertura_caso,
      descricao_caso,
      status_caso
    } = req.body;

    // Verifica se o status é válido
    if (status_caso && !['Em andamento', 'Arquivado', 'Finalizado'].includes(status_caso)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Status inválido. Use: Em andamento, Arquivado ou Finalizado' 
      });
    }
    
    const casoAtualizado = await Caso.findOneAndUpdate(
      { id_caso: req.params.id },
      { 
        titulo_caso, 
        responsavel_caso,
        processo_caso,
        data_abertura_caso,
        descricao_caso,
        status_caso
      },
      { new: true, runValidators: true }
    );
    
    if (!casoAtualizado) {
      return res.status(404).json({ success: false, error: 'Caso não encontrado' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Caso atualizado com sucesso', 
      data: casoAtualizado 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Excluir caso
exports.excluir = async (req, res) => {
  try {
    const caso = await Caso.findOneAndDelete({ id_caso: req.params.id });
    
    if (!caso) {
      return res.status(404).json({ success: false, error: 'Caso não encontrado' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Caso excluído com sucesso' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Buscar casos por status
exports.buscarPorStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Verifica se o status é válido
    if (!['Em andamento', 'Arquivado', 'Finalizado'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Status inválido. Use: Em andamento, Arquivado ou Finalizado' 
      });
    }
    
    const casos = await Caso.find({ status_caso: status });
    
    res.status(200).json({ 
      success: true, 
      data: casos 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};