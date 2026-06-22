# NOIR CELLAR 🍷

Loja de vinhos e produtos premium. E-commerce full stack construído com a stack MERN — MongoDB Atlas + Express + Node.js no backend e React + Vite + Redux Toolkit no frontend, com autenticação via JWT e integração com PayPal para pagamentos.

---

## Pré-requisitos

- Node.js v25+
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud) ou MongoDB local
- Conta no [PayPal Developer](https://developer.paypal.com/) para pagamentos (opcional em dev)

---

## Setup rápido

### Rodar tudo junto (recomendado)

```bash
cp .env.example .env  # edite com suas variáveis
npm install
cd frontend && npm install && cd ..
npm run dev           # inicia backend + frontend com concurrently
```

### Backend (somente)

```bash
# Na raiz do projeto — server.js fica aqui, não há subpasta backend/
cp .env.example .env
npm install
npm run server        # nodemon server.js — http://localhost:5000
```

### Frontend (somente)

```bash
cd frontend
npm install
npm run dev           # http://localhost:3000
```

### Popular o banco com dados de exemplo

```bash
npm run seed        # importa produtos, usuários e pedidos de exemplo
npm run seed:d      # destrói todos os dados do banco
```

---

## Configuração do backend (`.env`)

| Variável           | Descrição                              | Obrigatória |
| ------------------ | -------------------------------------- | :---------: |
| `MONGO_URI`        | URI de conexão do MongoDB Atlas        | ✅          |
| `JWT_SECRET`       | Chave secreta para assinar tokens JWT  | ✅          |
| `PORT`             | Porta do servidor (padrão: 3000/5000)  | Opcional    |
| `PAYPAL_CLIENT_ID` | Client ID da conta PayPal Developer    | Opcional    |
| `NODE_ENV`         | `development` ou `production`          | Opcional    |

> **Atenção:** em ambientes Windows com restrição de DNS, adicione ao topo do `server.js`:
> ```js
> import dns from 'dns';
> dns.setServers(['8.8.8.8', '8.8.4.4']);
> ```

---

## Estrutura

```
noir-cellar/
├── backend/                  # ou raiz do projeto
│   ├── config/
│   │   └── database.js       # Conexão com MongoDB Atlas
│   ├── controllers/          # Lógica de cada rota
│   ├── middleware/
│   │   ├── authMiddleware.js  # Proteção de rotas (JWT)
│   │   └── adminMiddleware.js # Restrição a admins
│   ├── models/
│   │   ├── User.js           # Usuário (com campo avatar)
│   │   ├── Product.js        # Produto
│   │   └── Order.js          # Pedido (com campo isCancelled)
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── orderRoutes.js
│   ├── seeder.js             # Script de seed do banco
│   └── server.js             # Entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── components/       # Componentes reutilizáveis
        ├── screens/          # 18 telas da aplicação
        ├── store/            # Redux Toolkit (slices + actions)
        └── main.jsx
```

---

## Funcionalidades

**Visitante**
- Navegar pelo catálogo e buscar produtos
- Ver detalhes de produto
- Adicionar ao carrinho (persistido no localStorage)

**Usuário autenticado**
- Login / Cadastro com JWT
- Checkout completo com endereço e pagamento via PayPal
- Histórico de pedidos
- Área "Minha Área" com edição de perfil, avatar e atalhos rápidos

**Admin**
- Dashboard com estatísticas
- CRUD completo de produtos, pedidos e usuários
- Cancelamento de pedidos

---

## Stack técnica

| Camada     | Tecnologia                                          |
| ---------- | --------------------------------------------------- |
| Runtime    | Node.js v25.5.0                                     |
| Backend    | Express v5.1.0, Mongoose v8.9.5                     |
| Auth       | bcryptjs v3, jsonwebtoken v9                        |
| Frontend   | React v19, Vite v8, Redux Toolkit v2                |
| UI         | React Bootstrap v2                                  |
| HTTP       | axios v1                                            |
| Dev tools  | concurrently v9, nodemon v3                         |
| Banco      | MongoDB Atlas (cloud)                               |
| Pagamento  | PayPal SDK                                          |
| Deploy     | Heroku                                              |

---

## Design

- **Background:** `#0d0d0d`
- **Gold:** `#c9a84c`
- **Wine:** `#7b2935`
- **Tipografia:** Playfair Display + Montserrat

---

## Rotas da API

| Grupo       | Base path        |
| ----------- | ---------------- |
| Produtos    | `/api/products`  |
| Auth        | `/api/auth`      |
| Usuários    | `/api/users`     |
| Pedidos     | `/api/orders`    |

---

## Projeto acadêmico

Desenvolvido como trabalho prático para a disciplina sob orientação do **Prof. Benir Falcão Pistille**. Entregas incluem código funcional, documentação técnica (DOCX), apresentação (PPTX) e fluxograma DevOps.
