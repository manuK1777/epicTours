import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.DATABASE_URL && isProduction) {
  throw new Error('DATABASE_URL is required in production mode.');
}
if (!process.env.DATABASE && !isProduction) {
  throw new Error('DATABASE, USER_NAME, and HOST_NAME are required in development mode.');
}

let sequelize;

if (isProduction) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    timezone: '+00:00',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER_NAME,
    process.env.PASSWORD,
    {
      host: process.env.HOST_NAME,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      timezone: '+00:00'
    }
  );
}

console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
if (isProduction) {
  console.log('Using DATABASE_URL for production');
} else {
  console.log('Database:', process.env.DATABASE);
  console.log('User:', process.env.USER_NAME);
  console.log('Host:', process.env.HOST_NAME);
  console.log('Port:', process.env.DB_PORT);
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection };
