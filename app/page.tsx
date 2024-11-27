"use client";
import React, { useEffect, useState } from "react";

import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
export default function MyApp() {
  const [todo, setTodo] = useState("");
  const [complete, setComplete] = useState(false);
  const [main, setMain] = useState<
    { todo: string; id: number; remaining: number; complete: boolean }[]
  >(
    typeof window !== "undefined" && localStorage.getItem("next-todo")
      ? JSON.parse(localStorage.getItem("next-todo") || "[]")
      : []
  );

  const [remaining, setRemaining] = useState<number>(
    main.length > 0 ? main[main.length - 1].remaining : 0
  );
  const [editId, setEditId] = useState<number | null>();

  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todo) {
      return false;
    } else if (todo && editId) {
      console.log(editId);
      setMain(
        main.map((item) => {
          if (item.id === editId) {
            return { ...item, todo: todo };
          }
          setEditId(null);
          return item;
        })
      );
    } else {
      setRemaining(remaining + 1);
      setMain([
        ...main,
        { todo, id: Date.now(), remaining: remaining + 1, complete },
      ]);
    }
    setTodo("");
  };
  const initialTodo = (
    <h2 className="text-[#eee] font-semibold text-center tracking-widest">
      No Todos Were Added Yet 🥺
    </h2>
  );
  useEffect(() => {
    localStorage.setItem("next-todo", JSON.stringify(main));
  }, [main, remaining]);
  const completeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if ((event.target as HTMLInputElement).checked) {
      setRemaining(remaining - 1);
      setComplete(true);
      setMain((perv) =>
        perv.map((item) => {
          if (item.id === id) {
            return { ...item, complete: true, remaining: remaining - 1 };
          }
          return item;
        })
      );
    } else {
      setRemaining(remaining + 1);
      setComplete(false);
      setMain((perv) =>
        perv.map((item) => {
          if (item.id === id) {
            return { ...item, complete: false, remaining: remaining + 1 };
          }
          return item;
        })
      );
    }
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
              id="checkbox"
              name="checkbox"
              checked={main.length > 0 ? main[idx].complete : false}
              onChange={(event) => {
                completeHandler(event, item.id);
              }}
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
    if (!(shallowTodo.length > 0 && shallowTodo[index].complete)) {
      setRemaining(remaining - 1);
      main[main.length - 1].remaining = remaining - 1;
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
    <div className={`todo-list-container `}>
      <div className="todo-list-header">
        <h1>TODO LIST</h1>
      </div>
      <div className="inputBar  relative h-[100px]">
        <form
          id="form"
          onSubmit={(event) => {
            formHandler(event);
          }}
        >
          <button className="add-todo-btn uppercase absolute right-5 -top-[50%] ">
            ADD TODO
          </button>
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
        <p>
          Remaining: <span className="remaining-count">{remaining}</span>
        </p>
        <button
          className="add-todo-btn uppercase hover:bg-red-500"
          onClick={() => {
            setMain([]);
            window.location.reload();
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
