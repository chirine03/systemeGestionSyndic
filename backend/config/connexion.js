import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: 'localhost',
  port: 3308,
  user: 'chirinedb',
  password: 'chirine@123',
  database: 'syndic_db',
});

console.log('✅ Connexion à la base de données réussie');

export default connection;
