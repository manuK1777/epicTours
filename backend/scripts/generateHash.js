import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const password = 'password123';
const salt = 10; // Same as in env file

bcrypt.hash(password, salt).then(hash => {
    console.log('Hashed password:', hash);
});
