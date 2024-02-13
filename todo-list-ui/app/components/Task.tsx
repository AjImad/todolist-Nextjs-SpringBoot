import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { Edit } from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "sonner";

type TaskProps = {
  taskTitle: string;
  taskId: string;
  revalidateTasks: () => void;
};

const Task = ({ taskTitle, taskId, revalidateTasks }: TaskProps) => {
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/${id}`);
      revalidateTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div key={taskId}>
      <div className="p-3 flex justify-between items-center mb-2">
        <div className="flex items-center space-x-3">
          <Checkbox />
          <p className="capitalize">{taskTitle}</p>
        </div>
        <div className="flex space-x-4 items-center">
          <Trash
            className="cursor-pointer"
            onClick={() => handleDelete(taskId)}
            size={18}
          />
          <Edit className="cursor-pointer" size={18} />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Task;
