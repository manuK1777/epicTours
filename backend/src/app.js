// app.js
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import venueBookerRoutes from './routes/venueBookerRoutes.js';
import eventRoutes  from './routes/eventRoutes.js';
import musicianRoutes from './routes/musicianRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import crewRoutes from './routes/crewRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { sequelize } from './db.js';
import './models/index.js';  // Import models to ensure they are registered
import dotenv from 'dotenv';
import { insertInitialData } from './start_data.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Configura el middleware CORS para que peuda recibir solicitudes de POST, PUT, DELETE, UPDATE, etc.
app.use(cors({
  credentials: true,
  origin: 'http://localhost:4200'
}));

app.use(cookieParser());

// Middleware para analizar el cuerpo de las solicitudes con formato JSON
app.use(express.json());

// Middleware para analizar el cuerpo de las solicitudes con datos de formulario
app.use(express.urlencoded({ extended: true })); // Para analizar datos de formularios en el cuerpo de la solicitud

// Initialize database function
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Drop existing unique constraints to prevent duplication
    try {
      await sequelize.query(`
        SELECT CONSTRAINT_NAME
        FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_NAME = 'Users' 
        AND CONSTRAINT_TYPE = 'UNIQUE'
        AND CONSTRAINT_NAME NOT IN ('username_unique', 'email_unique')
      `).then(async ([constraints]) => {
        if (constraints.length > 0) {
          const dropQueries = constraints.map(c => 
            `DROP INDEX ${c.CONSTRAINT_NAME} ON Users`
          );
          for (const query of dropQueries) {
            await sequelize.query(query);
          }
        }
      });
    } catch (error) {
      console.warn('Warning: Could not clean up constraints:', error.message);
    }

    // Sync with alter to allow model changes during development
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    
    // Insert initial data if needed
    const { User } = sequelize.models;
    const userCount = await User.count();
    if (userCount === 0) {
      await insertInitialData();
      console.log('Initial data inserted successfully');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Configure routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/locations', locationRoutes); 
app.use('/api/venueBooker',venueBookerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/musicians', musicianRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/test', testRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

export { app, initializeDatabase };
