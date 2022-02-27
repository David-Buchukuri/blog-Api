const express = require("express");
const cors = require("cors");
const DB = require("./connection");
const server = express();
server.use(cors());
server.use(express.json());

server.post("/insert", async (req, res) => {
  try {
    let query = `insert into blogs (title,body,author) VALUES ('${req.body.title}', '${req.body.body}', '${req.body.author}' ) RETURNING *`;
    let data = await DB.query(query);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(404).json({ message: "database error when inserting" });
  }
});

server.get("/blogs", async (req, res) => {
  try {
    let data = await DB.query(`select * from blogs`);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(404).json({ message: "database error when selecting blogs" });
  }
});

server.get("/blogs/:id", async (req, res) => {
  try {
    let data = await DB.query(
      `select * from blogs where id = '${req.params.id}'`
    );
    console.log(data);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(404).json({ message: "database error when selecting a blog" });
  }
});

server.delete("/delete/:id", async (req, res) => {
  try {
    await DB.query(`delete from blogs where id = '${req.params.id}'`);
    res.status(201).json("deleted succesfully");
  } catch (err) {
    res.status(404).json({ message: "database error when deleting" });
  }
});

server.use("*", (req, res, next) => {
  res.status(404).json(`can not find ${req.originalUrl} on server`);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening");
});
