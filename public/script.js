const table = document.getElementById("table")
   table.style.display = "flex"
   table.style.flexFlow = "column"
   table.style.alignItems = "center"
   table.style.width = "100%"
   table.style.height = "100%"


function input(add) {
   const formInput = document.createElement("form") 
   formInput.innerHTML = `
      <input style = "width: 100%; height: 25px;" type = "text"/>
      <input style = "width: 40%; height: 25px; background-color: springgreen; cursor: pointer;
      margin-left: 5px;" type = "date"/>
      <button style = "width: 20%; height: 30px; background-color: springgreen; cursor: pointer;
       margin-left: 5px; ">Add</button>
   `
   formInput.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = formInput.querySelector("input").value;
      const deadLine = formInput.querySelector("input[type = 'date']").value;
      add(value, deadLine);
  });
   
  formInput.style.display = "flex"
  formInput.style.width = "500px"
  formInput.style.alignItems = "center"
  formInput.style.backgroundColor = "darkgoldenrod"
  formInput.style.borderRadius = "5px"
  formInput.style.padding = "10px"
  

     
   return formInput
}

function listMembers (todo, onChange) {
   const chaildBox = document.createElement("div")

   chaildBox.style.marginTop = "20px"

   chaildBox.innerHTML = `
      <label style ="display: flex;width: 500px;border: 1px solid black;border-radius: 5px;margin-bottom: 15px;
         padding: 10px;background-color: orange;">
         <input style ="width: 20px; height: 20px; cursor: pointer;"type = "checkbox" ${todo.completed ? "checked" : ""}/>
         <span ${shouldHighlight(todo) ? ' style="margin-left: 5px; color: red;"' : ''}>
            ${todo.name} -DeadLine: ${todo.deadLine}
         </span>     
      </label>
   `
   const input = chaildBox.querySelector("input");
   input.addEventListener("change", (e) => {
       onChange(e.target.checked);
   })

   return chaildBox
}

function shouldHighlight(todo) {
   const deadlineDate = new Date(todo.deadLine);
   const currentDate = new Date();
   const timeDifference = deadlineDate.getTime() - currentDate.getTime();
   const oneDay = 24*60*60*1000;

   return timeDifference <= oneDay && !todo.completed;
}




function list(toDos, onChange) {
   const box = document.createElement("div")
   toDos.map(todo => {
      return listMembers(todo, (change) => {
         todo.completed = change;
         onChange()
      })
   }).forEach(element => {
      box.appendChild(element)
   });
   return box
}

function footer(toDos, onChange) {
   const footerBox = document.createElement("div")

   let compLength = toDos.filter(todo => todo.completed === true).length

   footerBox.innerHTML = `
      <span>${compLength} / ${toDos.length} Completed</span>
      <button style = "background-color: springgreen; width: 150px; height: 30px; cursor: pointer;">Clear Completed</button>
   `
   const btn = footerBox.querySelector("button");
    btn.addEventListener("click", () => {
        onChange(toDos.filter((todo) => todo.completed === false));
    });

   return footerBox
}

function toDoList() {
   
   let toDos = [];
   fetch("/todos").then((resp) => resp.json()).then((resp) => {
      toDos = resp;
      update()
   });
   

   function sendTodos() {
      fetch('/todos', {
         method: "post",
         headers: 
            {
               "content-type": "application/json"
            },
         body: JSON.stringify(toDos)
      })
   }

   const main = document.createElement("div")

   function update() {
  
      main.innerHTML = ""
      main.appendChild(input(function(newText, newDeadLine ) {
         toDos.push({
            name:newText,
            deadLine: newDeadLine,
            completed: false
         })
         sendTodos();
         update()
      }))
      main.appendChild(list(toDos, () => {
         sendTodos();
         update()
      }))
      main.appendChild(footer(toDos,(newToDos) => {
         toDos = newToDos;
         sendTodos();
         update()
      }))
   }

   main.style.display = "flex"
   main.style.flexFlow = "column"
   main.style.alignItems = "center"
   main.style.width = "100%"


   update();

   return main
}

table.appendChild(toDoList())