const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(bodyParser.json());

const connect = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "pass",
  database: "databaseName",
});

connect.connect((err) => { 
  if (err) console.error(err);
  console.log("success");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/:shortLink", (req, res) => {
  connect.query(
    `SELECT * FROM links WHERE shortLink = '${req.params.shortLink}'`,
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) return res.redirect(result[0].link);
      else return res.send("SHORT LİNK NOT FOUND");
    }
  );
});

app.post("/", (req, res) => {
  let link = req.body.val;
  let shortenLink =
    link[link.length - 3] +
    Date.now().toString().substring(9, 11) +
    link[link.length - 5];
  const insert = `INSERT INTO links (link, shortLink) VALUES ('${link}','${shortenLink}')`;
  connect.query(insert, (err, res) => {
    if (err) throw err;
  });
  res.json()
});

app.listen(3001);
