const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome do produto é obrigatório"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    category: {
      type: String,
      required: [true, "Categoria é obrigatória"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Preço é obrigatório"],
      min: 0,
    },
    imageUrl: {
      type: String,
      required: [true, "Imagem é obrigatória"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Descrição é obrigatória"],
      trim: true,
      maxlength: 500,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
