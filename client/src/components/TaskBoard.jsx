/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDrop, useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { format } from "date-fns";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ItemType = "TASK";

const TaskBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset } = useForm();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: "", description: "" });

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to WebSocket Server"));
    socket.on("taskUpdated", (updatedTasks) => setTasks(updatedTasks));
    return () => {
      socket.off("taskUpdated");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    axiosPublic.get("/tasks").then((response) => setTasks(response.data)).catch(console.error);
  }, [axiosPublic]);

  const onSubmit = async (data) => {
    if (!user?.email) return navigate("/login");
    const taskInfo = { title: data.title, description: data.description, author: user.email, category: "To-Do", date: new Date() };
    try {
      const response = await axiosPublic.post("/tasks", taskInfo);
      if (response.data.insertedId) {
        setTasks((prev) => [...prev, { ...taskInfo, _id: response.data.insertedId }]);
        reset();
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublic.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditedTask({ title: task.title, description: task.description });
  };

  const handleUpdate = async () => {
    try {
      const updatedTask = { ...editingTask, ...editedTask };
      const response = await axiosPublic.put(`/tasks/${updatedTask._id}`, updatedTask);
      if (response.data.modifiedCount > 0) {
        setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      }
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const moveTask = async (task, newCategory) => {
    task.category = newCategory;
    try {
      await axiosPublic.put(`/tasks/${task._id}`, task);
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      socket.emit("updateTask", task);
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="container min-h-screen mx-auto p-6 bg-slate-100">
        <form className="w-full md:w-1/2 mx-auto p-4 bg-white shadow rounded" onSubmit={handleSubmit(onSubmit)}>
          <input {...register("title")} maxLength={50} required placeholder="Task Title" className="border p-2 w-full mb-2" />
          <textarea {...register("description")} maxLength={500} required placeholder="Task Description" className="border p-2 w-full mb-2" rows="3" />
          <button type="submit" className="bg-primary text-white p-2 rounded w-full">Add Task</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {["To-Do", "In Progress", "Done"].map((category) => (
            <TaskColumn key={category} category={category} tasks={tasks} moveTask={moveTask} user={user} handleEdit={handleEdit} handleDelete={handleDelete} />
          ))}
        </div>
        {editingTask && (
  <div className="fixed inset-0 bg-black/45 flex justify-center items-center">
    <div className="bg-white mx-2 md:mx-0 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Edit Task</h2>
      <input 
        type="text" 
        value={editedTask.title} 
        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })} 
        className="border rounded-md outline-none border-violet-500 p-2 w-full mb-2" 
      />
      <textarea 
        rows={5} 
        value={editedTask.description} 
        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} 
        className="border rounded-md outline-none border-violet-500 p-2 w-full mb-2" 
      />
      <button onClick={handleUpdate} className="bg-primary text-white px-4 py-2 rounded">
        Update
      </button>
      <button onClick={() => setEditingTask(null)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
        Cancel
      </button>
    </div>
  </div>
)}
      </section>
    </DndProvider>
  );
};

const TaskColumn = ({ category, tasks, moveTask, user, handleEdit, handleDelete }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item) => moveTask(item.task, category),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });

  return (
    <div ref={drop} className={`p-4 bg-white shadow rounded ${isOver ? "bg-gray-200" : ""}`}>
      <h2 className="text-xl font-semibold mb-2">{category}</h2>
      {tasks.filter((task) => task.author === user?.email && task.category === category).map((task) => (
        <TaskItem key={task._id} task={task} handleEdit={handleEdit} handleDelete={handleDelete} />
      ))}
    </div>
  );
};

const TaskItem = ({ task, handleEdit, handleDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { task },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  });

  return (
    <div ref={drag} className={`p-4 bg-gray-100 rounded-md mb-2 flex justify-between ${isDragging ? "opacity-50" : ""}`}>
      <div>
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <p className="text-xs text-gray-500">{format(new Date(task.date), "PPP p")}</p>
      </div>
      <div className="flex gap-2">
        <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEdit(task)} />
        <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(task._id)} />
      </div>
    </div>
  );
};

export default TaskBoard;