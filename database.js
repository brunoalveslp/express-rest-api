const sqlite3 = require("sqlite3").verbose();
const md5 = require("md5");

const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(
    DBSOURCE,
    (err)=>{
        if(err){
            console.log(err.message);
            throw err;
        }

        console.log("Connected to the Database.");

        db.run(
            `CREATE TABLE user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text,
                email text UNIQUE,
                password text,
                CONSTRAINT email_unique UNIQUE(email)
            )`,
            (err)=>{
                if(err){
                    // table already created
                } else{
                    const insert = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
                    db.run(insert,["admin","bruno@kfkprivate.com.br",md5("admin")]);
                    db.run(insert,["user","user@kfkprivate.com.br",md5("kfk123")]);
                }
            }
        );
    }
);

module.exports = db;