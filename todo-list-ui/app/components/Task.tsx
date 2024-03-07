import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { useRef, useState } from "react";
import { Toaster, toast } from "sonner";

type TaskProps = {
  taskTitle: string;
  taskId: string;
  taskDone: boolean;
  revalidateTasks: () => void;
};

const Task = ({ taskTitle, taskId, taskDone, revalidateTasks }: TaskProps) => {
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState<String>(taskTitle);
  const [isEditing, setIsEditing] = useState(false);
  const isTaskDone = useRef(taskDone);
  const axiosAuth = useAxiosAuth();

  const handleDelete = async (id: string) => {
    try {
      await axiosAuth.delete(`http://localhost:8080/api/${id}`);
      revalidateTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(`${(error as any)?.response?.data?.message}`);
    }
  };

  const handleUpdateTask = async (id: string) => {
    try {
      if(isTaskDone.current === true){
        isTaskDone.current = false;
      }
      await axiosAuth.put(
        `http://localhost:8080/api/${id}?taskTitle=${updatedTaskTitle}&&isCompleted=${isTaskDone.current}`
      );
      toast.success("Task updated successfully");
      revalidateTasks();
    } catch (error) {
      toast.error(`${(error as any)?.response?.data?.message}`);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (updatedTaskTitle.trim() !== taskTitle.trim()) {
      handleUpdateTask(taskId);
    }
  };

  const handleCheck = async (id: string) => {
    isTaskDone.current = !isTaskDone.current;
    handleUpdateTask(taskId);
  };

  return (
    <div key={taskId} className="shadow-md rounded-md">
      <div className="p-3 flex justify-between items-center mb-1">
        <div className="flex items-center space-x-3 w-[90%]">
          <Checkbox
            checked={isTaskDone.current}
            onClick={() => handleCheck(taskId)}
          />
          <div onClick={() => setIsEditing(true)} className="w-[90%]">
            {isEditing ? (
              <Input
                autoFocus
                id="EditTask"
                defaultValue={taskTitle}
                onChange={(e) => setUpdatedTaskTitle(e.target.value)}
                onBlur={handleBlur}
                className="outline-none border-none capitalize"
              />
            ) : (
              <p
                className={cn(
                  "capitalize hover:cursor-pointer",
                  isTaskDone.current && "line-through text-gray-500"
                )}
              >
                {taskTitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-4 items-center">
          <Trash
            className="cursor-pointer"
            onClick={() => handleDelete(taskId)}
            size={18}
          />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Task;
