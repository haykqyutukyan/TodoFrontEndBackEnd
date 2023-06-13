import express from "express";
import path from "path";


const port = 3000; 
const app = express();

 
app.use(express.static("public"));

app.get("/", (req, res) => {
   res.sendFile(path.resolve("public/index.html"));
});


let curTime = new Date();
let day = curTime.getDate()
let month = curTime.getMonth()+1
let year = curTime.getFullYear()
let toDos = [
   {name:"learn C", deadLine: year + ".0" + month + "." + day, completed:false},
   {name:"learn JS", deadLine: year + ".0" + month + "." + day, completed:false},
   {name:"learn architecture", deadLine: year + ".0" + month + "." + day, completed:false}
]


app.get('/todos', (req, res) => {
  res.send(toDos);
});

// app.post('/todos', (req, res) => {
//    toDos = req.body;
//    res.send("Todos receieved")
// });


app.post('/todos', (req, res) => {
  const {name, deadLine, completed} = req.body;
  const newTodo = { name, deadLine, completed };
  toDos.push(newTodo);
  res.status(201).json(newTodo);
});


app.put('/todos/:index', (req, res) => {
  const index = req.params.index;
  const { name, deadLine, completed } = req.body;
  const todo = toDos[index];

  if (!todo) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  todo.name = name || todo.name;
  todo.deadLine = deadLine || todo.deadLine;
  todo.completed = completed !== undefined ? completed : todo.completed;

  res.json(todo);
});


app.delete('/todos/:index', (req, res) => {
  const index = req.params.index;
  const todo = toDos[index];

  if (!todo) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  toDos.splice(index, 1);
  res.sendStatus(204);
});


app.get('/todos/stats', (req, res) => {
  const completed = toDos.filter((todo) => todo.completed).length;
  const pending = toDos.filter((todo) => !todo.completed).length;
  res.json({ completed, pending });
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});