"use client";

import Spinner from "@/components/spinner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Check, Plus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import Task from "./Task";

const TodoList = () => {
  const axiosAuth = useAxiosAuth();
  const fetcher = async (url: string) => {
    try {
      const response = await axiosAuth.get(url);
      return response.data;
    } catch (error) {
      signOut();
    }
  };

  const [taskTitle, setTaskTitle] = useState<string>("");
  const { data: session } = useSession();

  const { data, error, isLoading, mutate } = useSWR("/tasks", fetcher);
  if (error) return <div>Error: {error}</div>;

  const handleCreateTask = async (taskTitle: string) => {
    try {
      await axiosAuth.post("/create-task", {
        taskName: taskTitle,
      });
      setTaskTitle("");
      mutate();
      toast.success("Task created successfully");
    } catch (error) {
      toast.error(`${(error as any)?.response?.data?.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosAuth.post("/auth/logout");
      signOut();
    } catch (error) {
      toast.error(`${(error as any)?.response?.data?.message}`);
    }
  };

  return (
    <div className="w-[450px] bg-white shadow-lg py-3 rounded">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-center py-4 uppercase font-bold">Today's Task</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex space-x-2">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </Avatar>
              <p>{`${session?.user?.firstname} ${session?.user?.lastname}`}</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator orientation="horizontal" className="mb-2" />
      <div className="h-[400px] overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-[100%]">
            <Spinner size="icon" />
          </div>
        ) : data?.length > 0 ? (
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
          {isLoading ? "-" : data?.length} Tasks
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
