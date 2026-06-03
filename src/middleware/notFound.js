function notFound(_request, response) {
  response.status(404).json({ message: "Rota não encontrada" });
}

module.exports = { notFound };
