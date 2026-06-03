const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");

const initialProducts = [
  {
    name: "Caneca Pixel",
    category: "Cozinha geek",
    price: 39.9,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    description: "Caneca com visual retrô para começar o dia no modo gamer.",
    stock: 15,
  },
  {
    name: "Camiseta RPG",
    category: "Moda geek",
    price: 79.9,
    imageUrl: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
    description: "Camiseta confortável com estampa inspirada em aventuras épicas.",
    stock: 12,
  },
  {
    name: "Luminária Nebulosa",
    category: "Decoração",
    price: 129.9,
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    description: "Luz ambiente para dar aquela vibe espacial no quarto ou setup.",
    stock: 8,
  },
  {
    name: "Mousepad Galactic",
    category: "Setup",
    price: 59.9,
    imageUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&w=900&q=80",
    description: "Mousepad grande, suave e pronto para longas maratonas de estudo ou jogo.",
    stock: 20,
  },
];

async function seedInitialData() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(initialProducts);
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@geekshop.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const adminExists = await User.findOne({ email: adminEmail });

  if (!adminExists) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "Administrador",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });
  }
}

module.exports = { seedInitialData };
