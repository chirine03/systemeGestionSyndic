import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3308,
      user: process.env.DB_USER || 'chirinedb',
      password: process.env.DB_PASSWORD || 'chirine@123',
      database: process.env.DB_NAME || 'syndic_db',
    });

    console.log('✅ Connexion à la base de données réussie');
    return connection;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    process.exit(1); // quitte si erreur
  }
}

const connection = await connectDB();

export default connection;
