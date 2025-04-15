// ================ controllers/usuarioController.js ================
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

// @desc    Cadastrar novo usuário
// @route   POST /api/usuarios
// @access  Public
exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome_completo, data_nascimento, email, senha, tipo_perfil } = req.body;
    
    // Verificar se usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    
    if (usuarioExistente) {
      return res.status(400).json({ 
        sucesso: false, 
        mensagem: 'Email já cadastrado' 
      });
    }
    
    // Criptografar senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    
    // Criar usuário
    const usuario = await Usuario.create({
      nome_completo,
      data_nascimento,
      email,
      senha: senhaHash,
      tipo_perfil
    });
    
    // Remover senha do resultado
    usuario.senha = undefined;
    
    res.status(201).json({
      sucesso: true,
      dados: usuario
    });
    
  } catch (error) {
    res.status(400).json({
      sucesso: false,
      mensagem: error.message
    });
  }
};

// @desc    Listar todos os usuários
// @route   GET /api/usuarios
// @access  Private
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    
    res.status(200).json({
      sucesso: true,
      contagem: usuarios.length,
      dados: usuarios
    });
    
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: error.message
    });
  }
};

// @desc    Obter um usuário pelo ID
// @route   GET /api/usuarios/:id
// @access  Private
exports.obterUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      dados: usuario
    });
    
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: error.message
    });
  }
};

// @desc    Atualizar um usuário
// @route   PUT /api/usuarios/:id
// @access  Private
exports.atualizarUsuario = async (req, res) => {
  try {
    const { nome_completo, data_nascimento, email, senha, tipo_perfil } = req.body;
    
    let dadosAtualizados = {
      nome_completo,
      data_nascimento,
      email,
      tipo_perfil
    };
    
    // Se houver uma nova senha, criptografá-la
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      dadosAtualizados.senha = await bcrypt.hash(senha, salt);
    }
    
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      dadosAtualizados,
      { new: true, runValidators: true }
    );
    
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    
    // Remover senha do resultado
    usuario.senha = undefined;
    
    res.status(200).json({
      sucesso: true,
      dados: usuario
    });
    
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: error.message
    });
  }
};

// @desc    Excluir um usuário
// @route   DELETE /api/usuarios/:id
// @access  Private
exports.excluirUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Usuário removido com sucesso'
    });
    
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: error.message
    });
  }
};

// @desc    Autenticar usuário e gerar token 
// @route   POST /api/auth/login
// @access  Public
exports.loginUsuario = async (req, res) => {
    try {
      const { email, senha } = req.body;
      
      // Verificar se o email existe
      const usuario = await Usuario.findOne({ email }).select('+senha');
      
      if (!usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Credenciais inválidas'
        });
      }
      
      // Verificar se a senha está correta
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaCorreta) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Credenciais inválidas'
        });
      }
      
      // Remover senha do resultado
      usuario.senha = undefined;
      
      res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso',
        dados: {
          id: usuario._id,
          nome: usuario.nome_completo,
          email: usuario.email,
          tipo_perfil: usuario.tipo_perfil
        }
      });
      
    } catch (error) {
      res.status(500).json({
        sucesso: false,
        mensagem: error.message
      });
    }
  };