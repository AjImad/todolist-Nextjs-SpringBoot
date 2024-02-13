"use client";

import { useState, useEffect } from "react";

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Todo list app
    </main>
  );
}
