// import express from "express";
// import { MongoClient } from "mongodb";


// const app = express();
// const client = new MongoClient("mongodb://localhost:27017")

 
// app.use(express.static("public"));
// app.use(express.json());



// (async function(){
//   await client.connect();
//   const cleanup = (event) => {
//     client.close();
//     process.exit()
//   }
//   process.on("SIGINT", cleanup);
//   process.on("SIGTERM", cleanup);

//   const db = client.db("TodoList")
//   const collection = db.collection("toDos")
//   await collection.insertOne(
//     {
//       toDos: [
//         {name:"learn C", deadLine: year + ".0" + month + "." + day, completed:false},
//         {name:"learn JS", deadLine: year + ".0" + month + "." + day, completed:false},
//         {name:"learn architecture", deadLine: year + ".0" + month + "." + day, completed:false}
//       ]
//     }
//   );

//   const findResult = await collection.find({}).toArray();
//   console.log(findResult)
  
// })(); 

// let curTime = new Date();
// let day = curTime.getDate()
// let month = curTime.getMonth()+1
// let year = curTime.getFullYear()
  
// let toDos = [
//    {name:"learn C", deadLine: year + ".0" + month + "." + day, completed:false},
//    {name:"learn JS", deadLine: year + ".0" + month + "." + day, completed:false},
//    {name:"learn architecture", deadLine: year + ".0" + month + "." + day, completed:false}
// ]

// app.get("/todos", (req, res) => {
//   res.send(toDos);
// });

//   app.post("/todos", (req, res) => {
//     toDos = req.body;
//     res.send("Todos reseved")
//   })

//   app.listen(3000)


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



