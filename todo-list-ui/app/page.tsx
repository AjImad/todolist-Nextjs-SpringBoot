"use client";

import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("you call me");
      fetch("http://localhost:8080/api/tasks") // Assuming Spring Boot runs on 8080
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`); // Handle HTTP errors
          }
          return res.json();
        })
        .then((data) => {
          console.log("data: ", data);
          setTasks(data);
        })
        .catch((err) => console.log("err: ", err));
    };
    fetchTasks();
    console.log("tasks: ", tasks);
  }, []);

  return (
    <div className="border-5 border-black">
      {/* Todo list app */}
      <TodoList />
    </div>
  );
}
