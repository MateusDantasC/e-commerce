import Product from '../models/Product.js';

// GET /api/products
// Público — lista todos os produtos
export const getProducts = async (req, res) => {
  const products = await Product.find({});

  if (!products.length) {
    return res.status(200).json({
      message: 'Nenhum produto cadastrado ainda.',
      products: [],
    });
  }

  res.json(products);
};

// GET /api/products/:id
// Público — retorna um produto pelo ID
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Produto não encontrado. Verifique o link ou volte à loja.');
  }

  res.json(product);
};

// POST /api/products
// Admin — cria novo produto
export const createProduct = async (req, res) => {
  const { name, price, image, brand, category, description, countInStock } = req.body;

  if (!name || !price || !image || !brand || !category || !description) {
    res.status(400);
    throw new Error('Preencha todos os campos obrigatórios do produto.');
  }

  const product = new Product({
    name, price, image, brand, category, description,
    countInStock: countInStock ?? 0,
    user: req.user._id,
  });

  const created = await product.save();
  res.status(201).json(created);
};

// PUT /api/products/:id
// Admin — atualiza produto existente
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Produto não encontrado para atualizar.');
  }

  const { name, price, image, brand, category, description, countInStock } = req.body;
  product.name         = name         ?? product.name;
  product.price        = price        ?? product.price;
  product.image        = image        ?? product.image;
  product.brand        = brand        ?? product.brand;
  product.category     = category     ?? product.category;
  product.description  = description  ?? product.description;
  product.countInStock = countInStock ?? product.countInStock;

  const updated = await product.save();
  res.json(updated);
};

// DELETE /api/products/:id
// Admin — remove produto
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Produto não encontrado para remover.');
  }

  await product.deleteOne();
  res.json({ message: 'Produto removido com sucesso.' });
};