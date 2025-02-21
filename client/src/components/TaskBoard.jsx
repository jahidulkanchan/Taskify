import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { format } from "date-fns";

const TaskBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset } = useForm();

  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: "", description: "" });

  // Fetch tasks on mount
  useEffect(() => {
    axiosPublic
      .get("/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [axiosPublic]);

  // Add Task
  const onSubmit = async (data) => {
    if (!user?.email) return navigate("/login");

    const taskInfo = {
      title: data.title,
      description: data.description,
      author: user.email,
      category: "To-Do",
      date: new Date(),
    };

    try {
      const response = await axiosPublic.post("/tasks", taskInfo);
      if (response.data.insertedId) {
        setTasks((prev) => [
          ...prev,
          { ...taskInfo, _id: response.data.insertedId },
        ]);
        reset();
      }
    } catch (err) {
      console.error("Error adding task:", err.message);
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    try {
      await axiosPublic.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Open Edit Modal
  const handleEdit = (task) => {
    setEditingTask(task);
    setEditedTask({ title: task.title, description: task.description });
  };

  // Handle Edit Submission
  const handleUpdate = async () => {
    try {
      const updatedTask = { ...editingTask, ...editedTask };
      const response = await axiosPublic.put(
        `/tasks/${updatedTask._id}`,
        updatedTask
      );

      if (response.data.modifiedCount > 0) {
        setTasks(
          tasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
      }
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handle Drag-and-Drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.category = result.destination.droppableId; // Update category

    try {
      // Send full updated task data to the backend
      await axiosPublic.put(`/tasks/${movedTask._id}`, movedTask);

      updatedTasks.splice(result.destination.index, 0, movedTask);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task category:", error);
    }
  };

  return (
    <section className="container min-h-screen mx-auto p-6 bg-slate-100">
      {/* Task Input Form */}
      <div className="flex justify-center items-center md:my-5 w-full md:w-8/12 lg:w-10/12 mx-auto">
        <form
          className="border border-gray-400  px-2 py-5 w-full md:10/12 lg:w-1/2 flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="title">Title</label>
          <input
            {...register("title")}
            maxLength={50}
            type="text"
            placeholder="Task Title"
            required
            className="outline-none w-full p-2 rounded-sm border border-violet-600"
          />

          <label htmlFor="description" className="mt-2">
            Description
          </label>
          <textarea
            {...register("description")}
            maxLength={500}
            required
            className="outline-none border border-violet-600 rounded-md"
            rows="3"
          ></textarea>

          <button
            type="submit"
            className="px-5 py-1 bg-primary mt-4 text-white rounded-full w-fit ml-auto"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Task Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-4">
          {["To-Do", "In Progress", "Done"].map((category) => (
            <Droppable droppableId={category} key={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h2 className="text-xl font-semibold mb-2">{category}</h2>

                  {tasks
                    .filter((task) => task.author === user?.email) // ✅ Only show tasks created by the logged-in user
                    .filter((task) => task.category === category)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-100 p-4 mb-2 rounded-md gap-1 flex justify-between items-center"
                          >
                            <div>
                              <h3 className="text-lg font-semibold">
                                {task.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {task.description}
                              </p>

                              {/* Show Formatted Date */}
                              <p className="text-xs text-gray-500 mt-2">
                                {task.date
                                  ? format(new Date(task.date), "PPP p")
                                  : "No Date"}
                              </p>
                            </div>

                            {/* Edit & Delete Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(task)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash size={18} />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/45  flex justify-center items-center">
          <div className="bg-white mx-2 md:mx-0 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Edit Task</h2>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="border rounded-md outline-none border-violet-500 p-2 w-full mb-2"
            />
            <textarea
              rows={5}
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              className="border rounded-md outline-none border-violet-500 p-2 w-full mb-2"
            />
            <div className="flex gap-2">
            <button
                onClick={() => setEditingTask(null)}
                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-primary cursor-pointer text-white px-4 py-2 rounded"
              >
                Update
              </button>
              
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TaskBoard;
