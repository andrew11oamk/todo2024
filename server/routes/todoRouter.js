import { Router } from "express";
import {
  getTasks,
  postTask,
  deleteTaskById,
  putTaskById,
} from "../controllers/TaskController.js";
import { auth } from "../helpers/auth.js";

const router = Router();

router.get("/", getTasks);
router.post("/create", auth, postTask);
router.delete("/delete/:id", auth, deleteTaskById);
router.put("/update/:id", auth, putTaskById);

export default router;
