# epicTours

EpicTours is a full-stack web application designed to streamline the management of music tours and events. Built with Angular 18 (frontend), Node.js (backend), Sequelize, and MySQL, it empowers users to efficiently organize and manage artists, musicians, crew members, events, venues, and contacts.

Key features include:

   - Artist Management: Link artists with musicians, crew members, and events.
   - Event Coordination: Plan events with single or multiple artists across 
     various venues, including support for festivals with multiple locations.
   - Venue Database: Maintain a comprehensive list of venues with detailed 
     contact information for seamless communication.
   - Contact Management: Create and manage contacts for artists, musicians, crew 
     members, and venue bookers.
   
EpicTours is tailored to the needs of tour managers, artists, and event organizers, providing an intuitive and centralized platform to simplify complex tour planning​


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
   git clone https://github.com/manuK1777/epicTours.git
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


---


### 2. Backend Setup

1. **Navigate to the Backend Directory**
   

2. **Install Dependencies**
   ```bash
   npm install
   ```  
   
3. **Configure Environment Variables**   
  
   - Create a .env file:

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


---



### 3. Frontend Setup     

1. **Navigate to the Frontend Directory**
   
  
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


## Initial Data

When you start the backend, the following sample data will be automatically created:

### Users

- Manager Users
  - Username: manager0
  - Email: manager0@epictours.com
  - Password: manager123
  - Role: manager

  - Username: manager1
  - Email: manager1@epictours.com
  - Password: manager123
  - Role: manager

- Admin User
  - Username: admin
  - Email: admin@epictours.com
  - Password: admin123
  - Role: admin

### Sample Data
- Artists: Kiss, Motley Crüe, Twisted Sister (with their musicians and crew members)
- Venues: Sunset Jazz Club, Palau de la Música Catalana, Nova Jazz Cava, Jamboree
- Events: Sample concerts and performances
- Venue Bookers: Contact persons for each venue

---

### User credentials for testing:

Manager can see and edit their own artists: create, edit and delete information, events, venues, musicians and crew members related to them.

Admin users can see and edit all artists, events, venues, musicians and crew members.

- Username: manager0
- Email: manager0@epictours.com
- Password: manager123

- Username: manager1
- Email: manager1@epictours.com
- Password: manager123

- Username: admin
- Email: admin@epictours.com
- Password: admin123
