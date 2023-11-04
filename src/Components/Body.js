import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faCheck,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
function Body() {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editId, setEditTodo] = useState(0);
  const [filter, setFilter] = useState("");
  const handleSubmition = (e) => {
    e.preventDefault();
  };

  //for removing the spaces between the words while checking to already exist or not
  const normalizeString = (input) => {
    return input.replace(/\s+/g, " ").trim();
  };

  // Add to List start
  const addToTodoList = () => {
    if (todo.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Opps!..",
        text: "Please enter something before adding it to the list!",
      });
    } else if (
      todoList.some((item) => item.list.trim() === normalizeString(todo))
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "This to-do Already exist in your list",
      });
    } else if (editId) {
      const toToWantToEdit = todoList.find(
        (eachTodo) => eachTodo.id === editId
      );

      const updatedTodoList = todoList.map((to) =>
        to.id === toToWantToEdit.id ? { id: to.id, list: todo } : to
      );
      saveToLocalStorage(updatedTodoList);
      setTodoList(updatedTodoList);
      setEditTodo(null);
      setTodo("");
    } else {
      setTodoList([
        { list: todo, id: Date.now(), completed: false },
        ...todoList,
      ]);
      saveToLocalStorage(todoList);
      setTodo("");
      
    }
    
  };
  // Add to List end

  const inputRef = useRef(null);

  //this useEffect function will cal when ever the reloading occur
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        const deletedOne = todoList.filter((eachTodo) => eachTodo.id !== id)
        setTodoList(deletedOne);
        saveToLocalStorage(deletedOne);
        Swal.fire("Deleted!", "Your to-do has been deleted.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your to-do is safe.", "info");
      }
    });
   
  };

  const todoCompleted = (id) => {
    const completedList = todoList.map((eachTodo) => {
      if (eachTodo.id === id) {
        console.log(eachTodo);
        return { ...eachTodo, completed: !eachTodo.completed };
      }
      return eachTodo;
    });
    setTodoList(completedList);
    saveToLocalStorage(completedList);
  };

  const onEdit = (id) => {
    const toToWantToEdit = todoList.find((eachTodo) => eachTodo.id === id);
    setTodo(toToWantToEdit.list);
    setEditTodo(toToWantToEdit.id);
    console.log(editId);
  };

  const saveToLocalStorage = (todoList) => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  };

  useEffect(() => {
    const storedTodoList = localStorage.getItem('todoList');
    if (storedTodoList) {
      setTodoList(JSON.parse(storedTodoList));
    }
  }, []);
  
  

  return (
    <div className="container">
      <h5 className="text-center mt-5">TODO LIST </h5>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className=" form-select py-2 my-3 col-3"
        >
        <option value=''>All</option>
        <option value="completed">Completed</option>
        <option value="non-completed">Non-Completed</option>
        </select>


      <div className="row d-flex justify-content-center">
        <div className="col-12 main-div" style={{ minHeight: 400 }}>
          <form className="row px-3 d-flex" onSubmit={handleSubmition}>
            <input
              className="col form-control  border border-dark py-3 ml-3"
              ref={inputRef}
              value={todo}
              placeholder="What to do Today..."
              onChange={(event) => setTodo(event.target.value)}
            ></input>
            <button
              className={`col-3  btn  mx-3 px-2 ${
                editId ? "btn-success" : "btn-dark"
              }`}
              onClick={addToTodoList}
            >
              {editId ? "Edit" : "Add"} <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </form>

          <div>
            <ul className="list-group mt-4 px-3 my-1">
              {todoList
                .filter((todo) => {
                  if (filter === "completed") {
                    return todo.completed;
                  } else if (filter === "non-completed") {
                    return !todo.completed;
                  } else {
                    return true; // Show all items when no filter is selected
                  }
                })
                .map((eachTodo) => (
                  <li
                    key={eachTodo.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <p id={eachTodo.completed ? "line_through" : "none"}>
                      {eachTodo.list}
                    </p>
                    <span>
                      <button
                        className="btn btn-link"
                        onClick={() => todoCompleted(eachTodo.id)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className="btn btn-link"
                        onClick={() => onEdit(eachTodo.id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-link"
                        onClick={() => onDelete(eachTodo.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;
