import fs from 'fs'
import path from 'path'
import { pool } from './db.js'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
const { sign } = jwt

const __dirname = import.meta.dirname

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname,"../db.sql"),"utf8");
    pool.query(sql)
}

const insertTestUser = async (email, password) => {
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });

        await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        console.log('User inserted successfully');
    } catch (error) {
        console.error('Error inserting user:', error);
        // Handle the error, e.g., log it, send an error response, etc.
    }
}

const getToken = (email) => {
    return sign({user: email},process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }