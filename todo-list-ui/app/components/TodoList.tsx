import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Task from "./Task";

const TodoList = () => {
  return (
    <div className="w-[450px] bg-white shadow-lg py-3 rounded text-[#757ee6]">
      <h3 className="text-center py-4 uppercase font-bold">Today's Task</h3>
      <Separator orientation="horizontal" className="mb-2" />
      <div className="max-h-[400px] overflow-y-auto">
        {Array.from({ length: 15 }).map((_, index) => (
          <Task key={index} taskTitle={`Task ${index + 1}`} />
        ))}
      </div>
      <Separator orientation="horizontal" className="mb-2" />
      <div className="flex justify-between items-center p-4 uppercase">
        <p className="">15 Tasks</p>{" "}
        <Button
          variant={"outline"}
          className="font-bold uppercase hover:bg-none hover:text-[#757ee6]"
        >
          Add Task <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
