# Noir Cellar 🍷

Loja de vinhos e produtos premium. E-commerce full stack com a stack MERN — MongoDB Atlas + Express + Node.js no backend e React + Vite + Redux Toolkit no frontend, com autenticação via JWT.

---

## Pré-requisitos

- Node.js v18+
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud) ou MongoDB local

---

## Setup rápido

### Rodar tudo junto (recomendado)

```bash
cp .env.example .env   # edite com suas variáveis
npm install
cd frontend && npm install && cd ..
npm run dev            # backend + frontend simultâneos via concurrently
```

### Backend (somente)

```bash
# server.js fica na raiz — não há subpasta backend/
npm run server         # nodemon server.js → http://localhost:5000
```

### Frontend (somente)

```bash
cd frontend
npm install
npm run dev            # http://localhost:3000
```

### Popular o banco com dados de exemplo

```bash
npm run seed           # importa produtos e usuários de exemplo
```

---

## Configuração do backend (`.env`)

| Variável     | Descrição                             | Obrigatória |
| ------------ | ------------------------------------- | :---------: |
| `MONGO_URI`  | URI de conexão do MongoDB Atlas       | ✅          |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT | ✅          |
| `JWT_EXPIRE` | Tempo de expiração do token (ex: 30d) | ✅          |
| `PORT`       | Porta do servidor (padrão: 5000)      | Opcional    |
| `NODE_ENV`   | `development` ou `production`         | Opcional    |

> **Atenção:** em ambientes Windows com restrição de DNS, adicione ao topo do `server.js`:
> ```js
> import dns from 'dns';
> dns.setServers(['8.8.8.8', '8.8.4.4']);
> ```

---

## Estrutura

```
mern-ecommerce/
├── config/
│   └── database.js              # Conexão com MongoDB Atlas
├── controllers/
│   ├── authController.js
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js        # Proteção de rotas (JWT)
│   └── errorMiddleware.js
├── models/
│   ├── User.js                  # Usuário (com campo avatar)
│   ├── Product.js               # Produto
│   └── Order.js                 # Pedido (com isCancelled)
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── userRoutes.js
│   └── orderRoutes.js
├── seeder.js                    # Script de seed do banco
├── server.js                    # Entry point
├── package.json
└── frontend/
    └── src/
        ├── components/          # Header, Footer, Loader, PrivateRoute, AdminRoute...
        ├── screens/             # Telas públicas, de usuário e admin
        │   ├── HomeScreen.jsx
        │   ├── LoginScreen.jsx
        │   ├── RegisterScreen.jsx
        │   ├── ProductScreen.jsx
        │   ├── CartScreen.jsx
        │   ├── CheckoutScreen.jsx
        │   ├── OrderScreen.jsx
        │   ├── MyOrdersScreen.jsx
        │   ├── ProfileScreen.jsx
        │   ├── DevelopmentScreen.jsx
        │   └── admin/
        │       ├── AdminOverviewScreen.jsx
        │       ├── AdminProductsScreen.jsx
        │       ├── AdminOrdersScreen.jsx
        │       └── AdminUsersScreen.jsx
        ├── slices/              # Redux slices (cart, user)
        ├── store.js
        └── App.jsx              # Definição de rotas
```

---

## Funcionalidades

**Visitante**
- Navegar pelo catálogo de produtos
- Ver detalhes de produto
- Adicionar ao carrinho (persistido no localStorage)

**Usuário autenticado**
- Login / Cadastro com JWT
- Checkout completo com endereço e método de pagamento
- Acompanhar pedido individual (`/orders/:id`)
- Histórico de pedidos (`/orders`)
- Perfil com edição de dados e avatar (`/profile`)

**Admin**
- Dashboard com visão geral (`/admin`)
- CRUD de produtos (`/admin/products`)
- Gestão de pedidos com cancelamento (`/admin/orders`)
- Gestão de usuários (`/admin/users`)

---

## Rotas da API

| Grupo    | Base path       |
| -------- | --------------- |
| Auth     | `/api/auth`     |
| Produtos | `/api/products` |
| Usuários | `/api/users`    |
| Pedidos  | `/api/orders`   |

---

## Stack técnica

| Camada    | Tecnologia                                       |
| --------- | ------------------------------------------------ |
| Runtime   | Node.js                                          |
| Backend   | Express v5, Mongoose v8                          |
| Auth      | bcryptjs v3, jsonwebtoken v9                     |
| Frontend  | React v19, Vite v8, Redux Toolkit v2             |
| UI        | React Bootstrap v2, Bootstrap v5                 |
| HTTP      | axios v1                                         |
| Dev tools | concurrently v9, nodemon v3                      |
| Banco     | MongoDB Atlas (cloud)                            |
| Deploy    | Heroku                                           |

---

## Design

- **Background:** `#0d0d0d`
- **Gold:** `#c9a84c`
- **Wine:** `#7b2935`
- **Tipografia:** Playfair Display + Montserrat

---

## Projeto acadêmico

Desenvolvido como trabalho prático para a disciplina sob orientação do **Prof. Benir Falcão Pistille**. Entregas incluem código funcional, documentação técnica (DOCX), apresentação (PPTX) e fluxograma DevOps.
