import mysql from 'mysql';
import express from 'express';
const app = express();

const db = new mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    port: 3306,
    database: "mydb"
});

db.connect((err)=>{
    if(err){
        console.log('Failed to connect database', err);
    } else {
        console.log('Connected to database');
    }
});


export {db};