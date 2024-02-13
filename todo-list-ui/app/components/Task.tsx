type TaskProps = {
  taskTitle: string;
};

const Task = ({ taskTitle }: TaskProps) => {
  return (
    <div>
      <div className="p-3 flex justify-between items-center mb-2">
        {taskTitle}
      </div>
    </div>
  );
};

export default Task;
