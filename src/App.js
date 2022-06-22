import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
// import { type } from "@testing-library/user-event/dist/type";

// const BACKEND_URL = "http://10.65.132.54:3000";

/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  // const [itemToAdd2, setItemToAdd2] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  // const[fi]

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };
  const [filtered, setFiltered] = useState([]);

  // button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

  const handleAddItem = () => { 
    axios({
      method: 'post',
      url: "https://api.todoist.com/rest/v1/tasks",
      data: {
        'content': `${itemToAdd}`,
        'project_id': 2293621079
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': uuidv4(),
        'Authorization': 'Bearer b065a34af31dbb86de998c113902648405485fee'
      }
    }).then((response) => {
      setItems([ ...items, response.data])
  })
    setItemToAdd("");

    }
    // setItems((prevItems) => [
    //   ...prevItems,
    //   { label: itemToAdd2, key:uuidv4()}
    // ])

  const [filterType, setFilterType] = useState("");


  const toggleItemDone = ({ id, done }) => {
    axios({
      method: 'post',
      url: `https://api.todoist.com/rest/v1/tasks/${id}/close`,
      done: !done,
      data: {
        'content': `${filtered}`,
        'project_id': 2293621079
      },
      headers: {
        'Authorization': 'Bearer b065a34af31dbb86de998c113902648405485fee'
      }
      }).then((response) => {
          // console.log("ererer")
          setItems(items.map((item) => {
              if (item.id === id) {
                  return {
                      ...item,
                      done: !done
                  }
              }
              return item
          }))


      })
  };

  const toggleItemReopen = ({ id, done }) => {
    axios({
      method: 'post',
      url: `https://api.todoist.com/rest/v1/tasks/${id}/reopen`,
      done: done,
      data: {
        'content': `${filtered}`,
        'project_id': 2293621079
      },
      headers: {
        'Authorization': 'Bearer b065a34af31dbb86de998c113902648405485fee'
      }
      }).then((response) => {
          // console.log("ererer")
          setItems(items.map((item) => {
              if (item.id === id) {
                  return {
                      ...item,
                      done: done
                  }
              }
              return item
          }))


      })
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  // N => map => N
    // N => filter => 0...N
  const handleItemDelete = (id) => {
      axios.delete(`https://api.todoist.com/rest/v1/projects/${id}`,{
      headers: {Authorization: 'Bearer b065a34af31dbb86de998c113902648405485fee'}, 
      }).then((response) => {
          const deletedItem = response.data;
          console.log('Было:',items)
          const newItems = items.filter((item) => {
              return deletedItem.id !== item.id
          })
          console.log('Осталось:',newItems)
          setItems(newItems)
      })
  };

  useEffect(() => {
    // console.log(searchValue)
      axios.get(`https://api.todoist.com/rest/v1/tasks`, {
        headers: {
          Authorization: 'Bearer b065a34af31dbb86de998c113902648405485fee'
        }
      }).then((response) => {
          setItems(response.data);
          // console.log(response.data)
      })
  }, [])

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems = 
  ! filterType || filterType == "all"
  ? items
  : filterType === "active"
  ? items.filter((item) => !item.done)
  : items.filter((item) => item.done)

  let Data = itemToAdd.length == 0 ? filteredItems : filtered


  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>
      <h2>
          {amountLeft} more to do, {amountDone} done
      </h2>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              id={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          Data.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item ${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
