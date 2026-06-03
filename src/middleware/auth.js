const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );
}

async function requireAuth(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Token ausente ou inválido" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await User.findById(payload.sub).select("-passwordHash");

    if (!user) {
      return response.status(401).json({ message: "Usuário não encontrado" });
    }

    request.user = user;
    next();
  } catch (_error) {
    return response.status(401).json({ message: "Sessão expirada ou inválida" });
  }
}

function requireAdmin(request, response, next) {
  if (request.user?.role !== "admin") {
    return response.status(403).json({ message: "Acesso restrito a administradores" });
  }

  next();
}

module.exports = {
  createToken,
  requireAuth,
  requireAdmin,
};
