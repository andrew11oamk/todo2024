import {
  selectAllTasks,
  insertTask,
  deleteTask,
  updateTask,
} from "../models/Task.js";
import { emptyOrRows } from "../helpers/utils.js";

const getTasks = async (req, res, next) => {
  try {
    const result = await selectAllTasks();
    return res.status(200).json(emptyOrRows(result));
  } catch (error) {
    return next(error);
  }
};

const postTask = async (req, res, next) => {
  if (!req.body.description || req.body.description.trim() === "") {
    const error = new Error("Invalid description for task");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const result = await insertTask(req.body.description);
    return res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    return next(error);
  }
};

const deleteTaskById = async (req, res, next) => {
  try {
    const result = await deleteTask(req.params.id);
    if (result.rowCount === 0) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    return next(error);
  }
};

const putTaskById = async (req, res, next) => {
  if (!req.body.description || req.body.description.trim() === "") {
    const error = new Error("Invalid description for task");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const result = await updateTask(req.params.id, req.body.description);
    if (result.rowCount === 0) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }
    return res.status(200).json({ message: "Task updated" });
  } catch (error) {
    return next(error);
  }
};

export { getTasks, postTask, deleteTaskById, putTaskById };
