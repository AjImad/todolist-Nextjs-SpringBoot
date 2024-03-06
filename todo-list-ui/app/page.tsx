"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import TodoList from "./components/TodoList";
import Spinner from "@/components/spinner";

export default function Home() {
  const {  status } = useSession();
  const session = useSession();
  console.log("token jwt session: ", session);
  console.log("status: ", status)
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="icon" />
      </div>
    );
  }
  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }
  return (
    <div>
      <TodoList />
    </div>
  );
}
