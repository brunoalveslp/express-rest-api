const express = require("express");
const db = require("./database");
const app = express();
const md5 = require("md5");

const bodyParser = require("body-parser");

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server Port

const HTTP_PORT = 8000;

// Start server

app.listen(HTTP_PORT, () => {
  console.log("Server is running at port %PORT%".replace("%PORT%", HTTP_PORT));
});

// ROOT Endpoint
app.get("/", (req, res, next) => {
  res.json({ message: "ok" });
});

// Endpoints

// Get All users

app.get("/api/users/", (req, res, next) => {
  const sql = "SELECT * FROM USER";
  const params = [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "Success",
      data: rows,
    });
  });
});

app.get("/api/user/:id", (req, res, next) => {
  const sql = "SELECT * FROM USER WHERE id = ?";
  const params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "Success",
      data: row,
    });
  });
});

// Create user

app.post("/api/user/", (req, res, next) => {
  const errors = [];

  if (!req.body.password) {
    errors.push("No password specified");
  }

  if (!req.body.email) {
    errors.push("No email specified");
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(", ") });
    return;
  }

  const data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
  };

  const sql = `INSERT INTO USER (name, email, password) VALUES (?,?,?)`;

  const params = [data.name, data.email, data.password];

  db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }

    res.json({
      message: "Success",
      data: data,
      id: this.lastID,
    });
  });
});

// Update user

app.patch("/api/user/:id", (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null,
  };

  db.run(
    `
            UPDATE USER
            SET
                name = COALESCE(?,name),
                email = COALESCE(?,email),
                password = COALESCE(?,password)
            WHERE id = ?
        `,
    [data.name, data.email, data.password, req.params.id],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      res.json({
        message: "Success",
        data: data,
        changes: this.changes,
      });
    }
  );
});


// Delete user

app.delete("/api/user/:id",(req, res, next)=>{
    db.run(
        `DELETE FROM USER WHERE ID =?`,
        req.params.id,
        (err, result)=>{
            if(err){
                res.status(400).json({"error": res.message});
                return;
            }

            res.json({"message":"deleted", changes: this.changes});
        }
    )
});

// Other Endpoints

app.use((req, res) => {
  res.status(404);
});
