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

const sequelize = new Sequelize(
  isProduction ? process.env.DATABASE_URL : process.env.DATABASE,
  isProduction ? undefined : process.env.USER_NAME,
  isProduction ? undefined : process.env.PASSWORD,
  {
    host: isProduction ? undefined : process.env.HOST_NAME,
    port: isProduction ? undefined : (process.env.DB_PORT || 3306),
    dialect: 'mysql',
    timezone: '+00:00',
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
  }
);

console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('Database:', process.env.DATABASE || 'Using DATABASE_URL');
console.log('User:', process.env.USER_NAME);
console.log('Host:', process.env.HOST_NAME);
console.log('Port:', process.env.DB_PORT);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection };


// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DATABASE,
//   process.env.USER_NAME,
//   process.env.PASSWORD,
//   {
//     host: process.env.HOST_NAME,
//     port: process.env.DB_PORT || 3306, 
//     dialect: 'mysql',
//     timezone: '+00:00',
//   }
// );

// console.log('Database:', process.env.DATABASE);
// console.log('User:', process.env.USER_NAME);
// console.log('Password:', process.env.PASSWORD);
// console.log('Host:', process.env.HOST_NAME);
// console.log('Port:', process.env.DB_PORT);

  
// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

// export { sequelize, testConnection };
