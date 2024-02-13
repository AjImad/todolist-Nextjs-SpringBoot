"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Task from "./Task";
import useSWR from "swr";
import Spinner from "@/components/spinner";
import Image from "next/image";

const TodoList = () => {
  const fetcher = (url: any) => fetch(url).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR(
    "http://localhost:8080/api/tasks",
    fetcher
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-[450px] bg-white shadow-lg py-3 rounded">
      <h3 className="text-center py-4 uppercase font-bold">Today's Task</h3>
      <Separator orientation="horizontal" className="mb-2" />
      <div className="h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-[100%]">
            <Spinner size="icon" />
          </div>
        ) : data.length > 0 ? (
          data?.map((task: any) => (
            <Task
              key={task.id}
              taskTitle={task.taskName}
              taskId={task.id}
              revalidateTasks={mutate}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground flex flex-col space-y-3 justify-center items-center h-[100%]">
            <div className="rounded-full bg-gray-200 p-3">
              <Image
                src="/empty.png"
                alt="No Task Availble"
                width={80}
                height={80}
              />
            </div>
            <p>No tasks available</p>
          </div>
        )}
      </div>
      <Separator orientation="horizontal" className="mb-2" />
      <div className="flex justify-between items-center p-4 uppercase">
        <p className="flex justify-between items-center">
          {isLoading ? "-" : data.length} Tasks
        </p>{" "}
        <Button
          variant={"outline"}
          className="font-bold uppercase hover:bg-none"
        >
          Add Task <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
