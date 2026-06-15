import express          from 'express';
import dotenv           from 'dotenv';
import cors             from 'cors';
import connectDatabase  from './config/database.js';
import productRoutes    from './routes/productRoutes.js';
import authRoutes       from './routes/authRoutes.js';
import userRoutes       from './routes/userRoutes.js';
import orderRoutes      from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
await connectDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/orders',   orderRoutes);

app.get('/', (req, res) => res.send('🍷 NOIR CELLAR API rodando...'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Servidor na porta ${PORT}`));