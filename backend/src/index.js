// index.js
import { app, initializeDatabase } from './app.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize database before starting the server
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
