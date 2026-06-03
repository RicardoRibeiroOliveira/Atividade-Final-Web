const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { createToken } = require("../middleware/auth");

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function register(request, response, next) {
  try {
    const { name, email, password } = request.body;

    if (!name || name.trim().length < 2) {
      return response.status(400).json({ message: "Informe um nome válido" });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return response.status(400).json({ message: "Informe um e-mail válido" });
    }

    if (!password || password.length < 6) {
      return response.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return response.status(409).json({ message: "E-mail já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
    });

    const token = createToken(user);

    response.status(201).json({
      message: "Cadastro realizado com sucesso",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return response.status(401).json({ message: "Credenciais inválidas" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return response.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = createToken(user);

    response.json({
      message: "Login realizado com sucesso",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function me(request, response) {
  response.json({ user: sanitizeUser(request.user) });
}

module.exports = {
  register,
  login,
  me,
};
