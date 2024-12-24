// app.js
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import eventRoutes  from './routes/eventRoutes.js';
import musicianRoutes from './routes/musicianRoutes.js';
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
    
    // Force sync to drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');
    
    // Insert initial data
    await insertInitialData();
    console.log('Initial data inserted successfully');
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
app.use('/api/contacts', contactRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/musicians', musicianRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/test', testRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

export { app, initializeDatabase };
