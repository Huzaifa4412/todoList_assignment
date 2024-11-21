"use client";
import React, { useEffect, useState } from "react";

import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
export default function MyApp() {
  const [todo, setTodo] = useState("");
  const [main, setMain] = useState<string[]>([]);
  const [completed, setCompleted] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRemaining(remaining + 1);
    console.log(remaining);
    setMain([...main, todo]);
    console.log(main);
    setTodo("");
  };
  const initialTodo = (
    <h2 className="text-[#eee] font-semibold text-center tracking-widest">
      No Todos Were Added Yet 🥺
    </h2>
  );
  useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(main));
  }, [main, remaining]);

  const renderTodo = main.map((item, idx) => {
    return (
      <li key={idx} className="flex items-center justify-between gap-3">
        <div className="checkbox">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              id="checkbox"
              name="checkbox"
              onClick={(event) => {
                if ((event.target as HTMLInputElement)?.checked) {
                  setCompleted(completed + 1);
                  setRemaining(remaining - 1);
                } else {
                  setCompleted(completed - 1);
                  setRemaining(remaining + 1);
                }
              }}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <p className="text-sm text-slate-100">{item}</p>
        <div className="icons flex gap-2">
          <div className="edit">
            <MdEdit
              onClick={() => editHandler(idx, item)}
              size={22}
              className="text-emerald-700 hover:text-emerald-800 cursor-pointer"
            />
          </div>
          <div className="delete">
            <MdDelete
              onClick={() => delHandler(idx)}
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
    shallowTodo.splice(id, 1);
    setMain(shallowTodo);
    setRemaining(remaining - 1);
  };
  const editHandler = (id: number, text: string) => {
    const shallowTodo = [...main];
    setTodo(text);
    shallowTodo.splice(id, 1);
    setMain(shallowTodo);
  };
  return (
    <div className={`todo-list-container `}>
      <div className="todo-list-header">
        <h1>TODO LIST</h1>
        <button className="add-todo-btn uppercase ">ADD TODO</button>
      </div>
      <div className="inputBar  relative h-[100px]">
        <form
          action=""
          id="form"
          onSubmit={(event) => {
            formHandler(event);
          }}
        >
          <input
            autoFocus
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Enter your todo"
            value={todo}
            className="w-[80%]  top-[50%] rounded-lg outline-none text-slate-200 placeholder:text-white placeholder:font-bold placeholder:uppercase placeholder:tracking-widest py-2 px-2
             absolute left-[10%] inputBar"
            type="text"
            name="todo"
            id="todo"
          />
        </form>
      </div>
      <div className="todo-list-body">
        <ul className="todo-list">
          {main.length > 0 ? renderTodo : initialTodo}
        </ul>
      </div>
      <div className="todo-list-footer">
        <p className="text-sm">
          Completed: <span className="completed-count">{completed}</span>
        </p>
        <p>
          Remaining: <span className="remaining-count">{remaining}</span>
        </p>
      </div>
    </div>
  );
}
