const stateProducts = document.getElementById("estado-produtos");
const listProducts = document.getElementById("lista-produtos");
const productTemplate = document.getElementById("template-produto");
const searchInput = document.getElementById("filtro-produtos");
const reloadButton = document.getElementById("recarregar-produtos");
const authFeedback = document.getElementById("auth-feedback");
const adminFeedback = document.getElementById("admin-feedback");
const loginForm = document.getElementById("form-login");
const registerForm = document.getElementById("form-register");
const productForm = document.getElementById("form-product");
const adminList = document.getElementById("painel-lista-produtos");
const clearButton = document.getElementById("limpar-formulario");

const API_BASE = "/api";
const CART_KEY = "geekshop-cart";
const TOKEN_KEY = "geekshop-token";
const USER_KEY = "geekshop-user";

let productsCache = [];

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function setState(element, message, type = "info") {
  element.className = `state state-${type}`;
  element.textContent = message;
}

function clearState(element) {
  element.className = "state";
  element.textContent = "";
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const foundItem = cart.find((item) => item.id === product._id);

  if (foundItem) {
    foundItem.quantity += 1;
  } else {
    cart.push({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart(cart);
  setState(stateProducts, `${product.name} adicionado ao carrinho.`, "success");
}

function renderProducts(products) {
  listProducts.innerHTML = "";

  if (!products.length) {
    setState(stateProducts, "Nenhum produto encontrado.", "info");
    return;
  }

  clearState(stateProducts);

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = productTemplate.content.cloneNode(true);
    const image = card.querySelector(".product-image");
    const category = card.querySelector(".product-category");
    const name = card.querySelector(".product-name");
    const description = card.querySelector(".product-description");
    const price = card.querySelector(".product-price");
    const button = card.querySelector(".add-cart");

    image.src = product.imageUrl;
    image.alt = product.name;
    category.textContent = product.category;
    name.textContent = product.name;
    description.textContent = product.description;
    price.textContent = formatCurrency(product.price);
    button.addEventListener("click", () => addToCart(product));

    fragment.appendChild(card);
  });

  listProducts.appendChild(fragment);
}

function renderAdminProducts(products) {
  adminList.innerHTML = "";

  if (!products.length) {
    adminList.innerHTML = '<div class="state state-info">Nenhum produto disponível.</div>';
    return;
  }

  adminList.innerHTML = products
    .map(
      (product) => `
        <article class="admin-card">
          <strong>${product.name}</strong>
          <span>${product.category}</span>
          <span>${formatCurrency(product.price)}</span>
          <p>${product.description}</p>
          <div class="admin-card-actions">
            <button class="button secondary" data-edit="${product._id}" type="button">Editar</button>
            <button class="button" data-delete="${product._id}" type="button">Excluir</button>
          </div>
        </article>
      `
    )
    .join("");

  adminList.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => fillProductForm(products.find((product) => product._id === button.dataset.edit)));
  });

  adminList.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteProduct(button.dataset.delete));
  });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Falha na requisição");
  }

  return data;
}

async function loadProducts() {
  try {
    setState(stateProducts, "Carregando produtos...", "info");
    const { products } = await fetchJson(`${API_BASE}/products`);
    productsCache = products;
    const filteredProducts = filterProducts();
    renderProducts(filteredProducts);
    await loadAdminProducts();
  } catch (error) {
    setState(stateProducts, error.message, "error");
    listProducts.innerHTML = "";
  }
}

function filterProducts() {
  const term = searchInput.value.trim().toLowerCase();

  if (!term) {
    return productsCache;
  }

  return productsCache.filter((product) => {
    return [product.name, product.category, product.description]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });
}

async function loadAdminProducts() {
  const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");

  if (!user || user.role !== "admin") {
    adminList.innerHTML = '<div class="state state-info">Faça login como admin para gerenciar produtos.</div>';
    return;
  }

  renderAdminProducts(productsCache);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function showFeedback(element, message, type = "success") {
  element.className = `state state-${type}`;
  element.textContent = message;
}

function clearFeedback(element) {
  element.className = "state";
  element.textContent = "";
}

async function handleAuthSubmit(event, endpoint, element) {
  event.preventDefault();
  clearFeedback(element);

  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await fetchJson(`${API_BASE}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSession(data);
    showFeedback(element, data.message, "success");
    form.reset();
    await loadProducts();
  } catch (error) {
    showFeedback(element, error.message, "error");
  }
}

function fillProductForm(product) {
  if (!product) {
    return;
  }

  productForm.name.value = product.name;
  productForm.category.value = product.category;
  productForm.price.value = product.price;
  productForm.stock.value = product.stock ?? 0;
  productForm.imageUrl.value = product.imageUrl;
  productForm.description.value = product.description;
  productForm.id.value = product._id;
}

function clearProductForm() {
  productForm.reset();
  productForm.id.value = "";
}

async function saveProduct(event) {
  event.preventDefault();
  clearFeedback(adminFeedback);

  const formData = new FormData(productForm);
  const payload = {
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    imageUrl: formData.get("imageUrl"),
    description: formData.get("description"),
  };

  const id = formData.get("id");

  try {
    const data = await fetchJson(`${API_BASE}/products${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    showFeedback(adminFeedback, data.message, "success");
    clearProductForm();
    await loadProducts();
  } catch (error) {
    showFeedback(adminFeedback, error.message, "error");
  }
}

async function deleteProduct(id) {
  const confirmed = window.confirm("Tem certeza que deseja excluir este produto?");
  if (!confirmed) {
    return;
  }

  try {
    const data = await fetchJson(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    showFeedback(adminFeedback, data.message, "success");
    await loadProducts();
  } catch (error) {
    showFeedback(adminFeedback, error.message, "error");
  }
}

function initSession() {
  const token = getToken();
  const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");

  if (token && user) {
    showFeedback(authFeedback, `Sessão ativa: ${user.name} (${user.role})`, "success");
  }
}

loginForm.addEventListener("submit", (event) => handleAuthSubmit(event, "login", authFeedback));
registerForm.addEventListener("submit", (event) => handleAuthSubmit(event, "register", authFeedback));
productForm.addEventListener("submit", saveProduct);
searchInput.addEventListener("input", () => renderProducts(filterProducts()));
reloadButton.addEventListener("click", loadProducts);
clearButton.addEventListener("click", clearProductForm);

initSession();
loadProducts();
