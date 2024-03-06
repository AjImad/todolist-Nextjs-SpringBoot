"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Task from "./Task";
import useSWR from "swr";
import { BareFetcher } from "swr";
import Spinner from "@/components/spinner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

const TodoList = () => {

  const fetcher = async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
  };

  const [taskTitle, setTaskTitle] = useState<string>("");

  const { data, error, isLoading, mutate } = useSWR(
    "/tasks",
    fetcher
  );
  if (error) return <div>Error: {error}</div>;

  const handleCreateTask = async (taskTitle: string) => {
    console.log("you call me");
    try {
      await axiosInstance.post("", {
        taskName: taskTitle,
      });
      setTaskTitle("");
      mutate();
      toast.success("Task created successfully");
    } catch (error) {
      console.log(error);
      toast.error(`${(error as any)?.response?.data?.message}`);
    }
  };

  return (
    <div className="w-[450px] bg-white shadow-lg py-3 rounded">
      <h3 className="text-center py-4 uppercase font-bold">Today's Task</h3>
      <Separator orientation="horizontal" className="mb-2" />
      <div className="h-[400px] overflow-y-auto p-2">
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
              taskDone={task.isCompleted}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              className="font-bold uppercase hover:bg-none"
            >
              Add Task <Plus size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create your Todo List by adding new tasks for a productive day!
                ✍️
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  id="EditTask"
                  defaultValue={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="outline-none border-none"
                />
              </div>
              <DialogClose asChild>
                <Button
                  type="submit"
                  size="sm"
                  className="px-3"
                  disabled={taskTitle.trim().length === 0}
                  onClick={() => handleCreateTask(taskTitle)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setTaskTitle("")}
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TodoList;
