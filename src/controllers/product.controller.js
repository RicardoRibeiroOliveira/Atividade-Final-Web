const Product = require("../models/Product");

async function listProducts(_request, response, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    response.json({ products });
  } catch (error) {
    next(error);
  }
}

async function getProductById(request, response, next) {
  try {
    const product = await Product.findById(request.params.id);

    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }

    response.json({ product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(request, response, next) {
  try {
    const { name, category, price, imageUrl, description, stock } = request.body;

    const product = await Product.create({
      name,
      category,
      price,
      imageUrl,
      description,
      stock,
    });

    response.status(201).json({
      message: "Produto criado com sucesso",
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(request, response, next) {
  try {
    const product = await Product.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }

    response.json({
      message: "Produto atualizado com sucesso",
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(request, response, next) {
  try {
    const product = await Product.findByIdAndDelete(request.params.id);

    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }

    response.json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
