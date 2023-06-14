
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const client = new MongoClient("mongodb://localhost:27017");

(async function () {
  await client.connect();
  const cleanup = (event) => {
    client.close();
    process.exit();
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  const db = client.db("TodoList");
  const collection = db.collection("toDos");

  app.use(express.static("public"));
  app.use(express.json());

  app.get("/todos", async (req, res) => {
    const dbTodos = await collection.findOne();
    res.send(dbTodos.toDos);
  });

  app.post("/todos", async (req, res) => {
    const newTodos = req.body;
    await collection.updateOne({}, { $set: { toDos: newTodos } });
    res.send("Todos received");
  });

  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
})();



