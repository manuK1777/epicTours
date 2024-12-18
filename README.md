# S8-Inprocode

S8-Inprocode is a full-stack web exercise built with Angular 18 (frontend), Node.js (backend), Sequelize, and MySQL. The application allows users to manage events and locations with a calendar interface a map, and displays the data also in charts.

## Table of Contents
1. [Requirements](#requirements)
2. [Setup Instructions](#setup-instructions)
    - [Database Setup](#database-setup)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
3. [How to Run](#how-to-run)
4. [Optional: Manual Database Setup](#optional-manual-database-setup)
5. [Troubleshooting](#troubleshooting)

---

## Requirements

Before starting, ensure you have the following installed:

- **Node.js** (>=14)
- **MySQL** (>=8.0)
- **Git**

---

## Setup Instructions

## Clone the repository
   ```bash
   git clone https://github.com/manuK1777/S8-inprocode-v3.git
   ```

### 1. Database Setup

1. **Start MySQL Server**
   - Ensure your MySQL server is running on your system.

2. **Create the Database**
   - Log in to MySQL:
     ```bash
     mysql -u root -p
     ```
   - Create the database:
     ```sql
     CREATE DATABASE epictours;
     ```

3. **Import the Schema (Optional)**
   - If you want to manually set up the database structure, you can import the schema file:
     ```bash
     mysql -u root -p epictours < backend/epictours_schema.sql
     ```

---

### 2. Backend Setup

1. **Navigate to the Backend Directory**
   ```bash
   cd backend
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```  
3. **Configure Environment Variables**   
   - Create a .env file:
   ```bash
    touch .env
   ```  
   - Edit the .env file with your MySQL credentials and other configurations:
   ```bash
   HOST_NAME=localhost
   USER_NAME=root
   PASSWORD=yourpass
   DATABASE=epictours
   JWT_SECRET=mfefkuhi345bhf543fdo3k2rjkofn2mbikb19rh
   CLIENT_URL=localhost://8090
   NODE_ENV=development
   BASE_DIR=
   DB_PORT=3306
   ```
4. **Seed the Database**  
   - When you start the backend, the database schema will be created, and initial data will be   
     inserted automatically: 
   ```bash
   npm start
   ```
   - The backend will be available at http://localhost:3000.

### 3. Frontend Setup     

1. **Navigate to the Frontend Directory**
   ```bash
   cd ..
   cd frontend
   ```
2. **Install Dependencies**   
   ```bash
   npm install
   ```

3. **Start the Frontend**
   - Run the Angular development server:
   ```bash
   npx ng serve
   ```
   - The frontend will be available at http://localhost:4200.


4. **Test the Application**  
   - Open http://localhost:4200 in your browser.
   
---

## Optional: Manual Database Setup

If you prefer to manually set up the database schema and skip Sequelize's automatic creation:

1. **Import the Schema**
   ```bash
   mysql -u root -p epictours < backend/epictours_schema.sql
   ```

2. **Seed the Data**   
   - Start the backend to insert initial data:
   ```bash
   npm start
   ```

## Troubleshooting

   - Error: Access Denied for User
     Check your .env file for correct database credentials.

   - Angular Fails to Connect to Backend
     Ensure the apiUrl in environment.ts matches the backend URL.   
