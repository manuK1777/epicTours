import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST_NAME,
    port: process.env.DB_PORT || 3306, 
    dialect: 'mysql',
    timezone: '+00:00',
  }
);

console.log('Database:', process.env.DATABASE);
console.log('User:', process.env.USER_NAME);
console.log('Password:', process.env.PASSWORD);
console.log('Host:', process.env.HOST_NAME);
console.log('Port:', process.env.DB_PORT);


const syncroModel = async () => {
  try {
    // Sincronizar el modelo con la base de datos (crear la tabla si no existe)
    // Con "alter: true" se sincronizan las columnas y se crean/eliminan si fuera necesario
    await sequelize.sync({ force: false }).then(() => {
      console.log('Modelos sincronizado con la base de datos');
    }); 
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
  
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await syncroModel();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection };

