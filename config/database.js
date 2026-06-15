import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erro MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDatabase;