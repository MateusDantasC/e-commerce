import mongoose        from 'mongoose';
import dotenv          from 'dotenv';
import connectDatabase from './config/database.js';
import Product         from './models/Product.js';
import User            from './models/User.js';

dotenv.config();

const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const products = [
  // ── Vinhos Tintos ──
  {
    name: 'Château Margaux 2019',
    image: img('photo-1474722883778-792e7990302f'),
    brand: 'Château Margaux',
    category: 'Vinho Tinto',
    description: 'Um dos grands crus mais icônicos de Bordeaux. Notas de cassis, cedro e violeta com taninos sedosos e final longo.',
    price: 1290,
    countInStock: 12,
  },
  {
    name: 'Sassicaia 2020',
    image: img('photo-1558618666-fcd25c85cd64'),
    brand: 'Tenuta San Guido',
    category: 'Vinho Tinto',
    description: 'Super Toscano lendário. Blend de Cabernet Sauvignon e Cabernet Franc com estrutura impecável e elegância rara.',
    price: 1890,
    countInStock: 5,
  },
  {
    name: 'Malbec Achaval Ferrer',
    image: img('photo-1510812431401-41d2bd2722f3'),
    brand: 'Achaval Ferrer',
    category: 'Vinho Tinto',
    description: 'Malbec argentino de alta expressão da região de Mendoza. Encorpado, com ameixa madura, especiarias e taninos aveludados.',
    price: 310,
    countInStock: 22,
  },

  // ── Vinhos Brancos ──
  {
    name: 'Cloudy Bay Sauvignon Blanc',
    image: img('photo-1547595628-c61a29f496f0'),
    brand: 'Cloudy Bay',
    category: 'Vinho Branco',
    description: 'Ícone neozelandês de Marlborough. Fresco e vibrante, com notas de maracujá, limão siciliano e toque herbáceo elegante.',
    price: 220,
    countInStock: 18,
  },
  {
    name: 'Puligny-Montrachet 1er Cru',
    image: img('photo-1553361371-9b22f78e8b1d'),
    brand: 'Louis Jadot',
    category: 'Vinho Branco',
    description: 'Chardonnay borgonhês premier cru de elegância suprema. Mineral, com avelã tostada, frutas brancas e acidez cristalina.',
    price: 780,
    countInStock: 7,
  },

  // ── Espumantes ──
  {
    name: 'Dom Pérignon Vintage 2015',
    image: img('photo-1578911373434-0cb395d2cbfb'),
    brand: 'Dom Pérignon',
    category: 'Espumante',
    description: 'Champagne de prestígio com borbulhas finíssimas. Notas de brioche, frutas brancas e mineralidade inconfundível.',
    price: 980,
    countInStock: 6,
  },
  {
    name: 'Veuve Clicquot Brut',
    image: img('photo-1556679343-c7306c1976bc'),
    brand: 'Veuve Clicquot',
    category: 'Espumante',
    description: 'Champagne icônico da famosa viúva. Borbulhas persistentes, notas de brioche, maçã verde e mel, com final longo e fresco.',
    price: 560,
    countInStock: 10,
  },

  // ── Whiskies ──
  {
    name: 'Glenfarclas 25 Years',
    image: img('photo-1527281400683-1aae777175f8'),
    brand: 'Glenfarclas',
    category: 'Whisky',
    description: 'Single malt escocês envelhecido 25 anos em barris de xerez. Complexo, com notas de frutas secas, especiarias e chocolate amargo.',
    price: 890,
    countInStock: 8,
  },
  {
    name: 'Macallan 18 Sherry Oak',
    image: img('photo-1569529465841-dfecdab7503b'),
    brand: 'The Macallan',
    category: 'Whisky',
    description: 'Envelhecido exclusivamente em barris de xerez europeu por 18 anos. Rico, com frutas secas, gengibre e chocolate negro.',
    price: 1450,
    countInStock: 4,
  },
  {
    name: 'Hibiki Japanese Harmony',
    image: img('photo-1541614101331-1a5a3a194e92'),
    brand: 'Suntory',
    category: 'Whisky',
    description: 'Blended whisky japonês com maltes envelhecidos em cinco tipos de barris. Floral, delicado, com notas de mel, laranja e sândalo.',
    price: 680,
    countInStock: 7,
  },
  {
    name: 'Johnnie Walker Blue Label',
    image: img('photo-1504275107627-0c2ba7a43dba'),
    brand: 'Johnnie Walker',
    category: 'Whisky',
    description: 'O blend mais sofisticado da Johnnie Walker, feito de maltes raros. Sedoso, com mel, frutas maduras e defumado suave.',
    price: 750,
    countInStock: 9,
  },

  // ── Gins ──
  {
    name: "Hendrick's Orbium",
    image: img('photo-1614313511387-1436a4480ebb'),
    brand: "Hendrick's",
    category: 'Gin',
    description: 'Edição especial com extrato de quinino e absinto. Floral, herbáceo e com marcante amargor elegante. Ideal para Martini seco.',
    price: 320,
    countInStock: 20,
  },
  {
    name: 'Monkey 47 Schwarzwald',
    image: img('photo-1606107557195-0e29a4b5b4aa'),
    brand: 'Monkey 47',
    category: 'Gin',
    description: 'Gin alemão da Floresta Negra com 47 botânicos únicos. Complexo, com pimenta, frutas e ervas frescas em harmonia.',
    price: 390,
    countInStock: 14,
  },
  {
    name: 'Tanqueray No. Ten',
    image: img('photo-1609951651556-5334e2706168'),
    brand: 'Tanqueray',
    category: 'Gin',
    description: 'Destilado em alambique pequeno com frutas cítricas frescas. Limpo, cítrico e floral, perfeito para um Martini clássico.',
    price: 210,
    countInStock: 25,
  },

  // ── Cervejas Artesanais ──
  {
    name: 'Štrawinsky Craft IPA',
    image: img('photo-1608270586620-248524c67de9'),
    brand: 'Štrawinsky',
    category: 'Cerveja Artesanal',
    description: 'IPA artesanal de lúpulo americano com aromas cítricos intensos, leve amargor e finalização tropical refrescante.',
    price: 42,
    countInStock: 50,
  },
  {
    name: 'Chimay Grande Réserve',
    image: img('photo-1535958636474-b021ee887b13'),
    brand: 'Chimay',
    category: 'Cerveja Artesanal',
    description: 'Trapista belga encorpada, fermentada por monges. Notas de caramelo, frutas escuras e especiarias. 9% ABV.',
    price: 65,
    countInStock: 35,
  },
  {
    name: 'Delirium Tremens',
    image: img('photo-1571613316887-6f8d5cbf7ef6'),
    brand: 'Huyghe Brewery',
    category: 'Cerveja Artesanal',
    description: 'Belgian Strong Ale de tripla fermentação, 8.5% ABV. Levemente frutada com notas de banana, cravo e final suave.',
    price: 58,
    countInStock: 30,
  },

  // ── Destilados ──
  {
    name: 'Patrón Silver Tequila',
    image: img('photo-1516535794938-6063878f08cc'),
    brand: 'Patrón',
    category: 'Destilado',
    description: 'Tequila 100% agave azul, destilada artesanalmente. Suave, com notas de agave fresco, cítrico e leve pimenta no final.',
    price: 290,
    countInStock: 15,
  },
  {
    name: 'Diplomatico Reserva Exclusiva',
    image: img('photo-1551538827-9c037cb4f32a'),
    brand: 'Diplomatico',
    category: 'Destilado',
    description: 'Rum venezuelano envelhecido 12 anos. Extraordinariamente suave, com notas de toffee, chocolate, laranja e baunilha.',
    price: 340,
    countInStock: 11,
  },
  {
    name: 'Hennessy XO Cognac',
    image: img('photo-1491553895911-0055eca6402d'),
    brand: 'Hennessy',
    category: 'Destilado',
    description: 'Blend de mais de 100 eaux-de-vie envelhecidas. Floral e frutado na entrada, com especiarias quentes e final longo de chocolate.',
    price: 1120,
    countInStock: 6,
  },
];

const importData = async () => {
  try {
    await connectDatabase();

    await mongoose.connection.collection('products').drop().catch(() => {});
    await mongoose.connection.collection('users').drop().catch(() => {});

    const adminUser = await User.create({
      name: 'Admin NOIR CELLAR',
      email: 'admin@noircellar.com',
      password: 'admin123456',
      isAdmin: true,
    });

    const productsWithUser = products.map(p => ({ ...p, user: adminUser._id }));
    await Product.insertMany(productsWithUser);

    console.log('✅ Dados importados com sucesso!');
    console.log(`📦 ${products.length} produtos inseridos`);
    console.log('📧 Admin: admin@noircellar.com | 🔑 Senha: admin123456');
    process.exit();
  } catch (error) {
    console.error('❌ Erro no seeder:', error.message);
    process.exit(1);
  }
};

importData();