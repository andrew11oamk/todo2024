import fs from "fs";
import path from "path";
import { hash } from "bcrypt";
import { pool } from "./db.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

const __dirname = path.resolve();

const initializeTestDb = () => {
  const sql = fs.readFileSync(path.resolve(__dirname, "database.sql"), "utf8");
  pool.query(sql);
};

const insertTestUser = (email, password) => {
  return new Promise((resolve, reject) => {
    hash(password, 10, (error, hashedPassword) => {
      if (error) return reject(error);
      pool.query(
        "insert into account (email, password) values ($1, $2)",
        [email, hashedPassword],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });
};

const getToken = (email) => {
  return sign({ user: email }, process.env.JWT_SECRET_KEY);
};

export { initializeTestDb, insertTestUser, getToken };
