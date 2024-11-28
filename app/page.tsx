"use client";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export default function MyApp() {
  const [todo, setTodo] = useState("");
  const [complete, setComplete] = useState(false);
  const [main, setMain] = useState<
    { todo: string; id: number; remaining: number; complete: boolean }[]
  >([]);
  const [remaining, setRemaining] = useState<number>(0);
  const [editId, setEditId] = useState<number | null>(null);

  // Load data from localStorage once on initial client render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTodos = localStorage.getItem("next-todo");
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        setMain(parsedTodos);
        setRemaining(parsedTodos.filter((todo: any) => !todo.complete).length);
      }
    }
  }, []); // This effect runs only once after the initial render

  // Save data to localStorage whenever 'main' or 'remaining' changes
  useEffect(() => {
    if (typeof window !== "undefined" && main.length > 0) {
      localStorage.setItem("next-todo", JSON.stringify(main));
    }
  }, [main]); // This effect runs whenever 'main' changes

  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todo) {
      return;
    }

    if (todo && editId) {
      // Update the todo
      setMain(
        main.map((item) => {
          if (item.id === editId) {
            return { ...item, todo: todo };
          }
          return item;
        })
      );
      setEditId(null);
    } else {
      // Add a new todo

      setMain([
        ...main,
        { todo, id: Date.now(), remaining: remaining + 1, complete },
      ]);
    }

    setTodo(""); // Reset the input
  };

  const completeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      setComplete(true);
      setRemaining(remaining - 1);
    } else {
      setComplete(false);
      setRemaining(remaining + 1);
    }

    setMain((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            complete: checked,
            remaining: checked ? remaining - 1 : remaining + 1,
          };
        }
        return item;
      })
    );
  };

  const renderTodo = main.map((item, idx) => {
    return (
      <li
        key={item.id}
        id={item.id.toString()}
        className="flex items-center justify-between gap-3"
      >
        <div className="checkbox">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={item.complete}
              onChange={(event) => completeHandler(event, item.id)}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <p className="text-sm text-slate-100">{item.todo}</p>
        <div className="icons flex gap-2">
          <div className="edit">
            <MdEdit
              onClick={() => editHandler(item.id)}
              size={22}
              className="text-emerald-700 hover:text-emerald-800 cursor-pointer"
            />
          </div>
          <div className="delete">
            <MdDelete
              onClick={() => delHandler(item.id)}
              size={22}
              className="text-red-600 hover:text-red-700 cursor-pointer"
            />
          </div>
        </div>
      </li>
    );
  });

  const delHandler = (id: number) => {
    const shallowTodo = [...main];
    const index = shallowTodo.findIndex((todo) => todo.id === id);
    if (shallowTodo.length > 0 && !shallowTodo[index].complete) {
      setRemaining(remaining - 1);
    }

    shallowTodo.splice(index, 1);
    setMain(shallowTodo);
  };

  const editHandler = (id: number) => {
    const findTodo = main.find((item) => item.id === id);
    setTodo(findTodo?.todo || "");
    setEditId(findTodo?.id);
  };

  return (
    <div className="todo-list-container">
      <div className="todo-list-header">
        <h1>TODO LIST</h1>
      </div>
      <div className="inputBar relative h-[100px]">
        <form id="form" onSubmit={formHandler}>
          <button className="add-todo-btn uppercase absolute right-5 -top-[50%]">
            ADD TODO
          </button>
          <input
            autoFocus
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Enter your todo"
            value={todo}
            className="w-[80%] top-[50%] rounded-lg outline-none text-slate-200 placeholder:text-white placeholder:font-bold placeholder:uppercase placeholder:tracking-widest py-2 px-2 absolute left-[10%] inputBar"
            type="text"
            name="todo"
            id="todo"
          />
        </form>
      </div>
      <div className="todo-list-body">
        <ul className="todo-list">
          {main.length > 0 ? renderTodo : <h2>No Todos Added Yet 🥺</h2>}
        </ul>
      </div>
      <div className="todo-list-footer">
        <p>
          Remaining: <span className="remaining-count">{remaining}</span>
        </p>
        <button
          className="add-todo-btn uppercase hover:bg-red-500"
          onClick={() => {
            setMain([]);
            setRemaining(0);
            if (typeof window !== "undefined") {
              localStorage.removeItem("next-todo"); // clear localStorage when clearing all todos
            }
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
