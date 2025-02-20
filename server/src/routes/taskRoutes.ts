import { Router } from "express"
import { authMiddleware } from "../middleware/auth/authMiddleware"
import { upload } from "../middleware/fileUploadMiddleware"
import {
	createTask,
	getNextWeekTask,
	getPrevWeekTask,
	getTask
} from "../controller/taskController"

const router = Router()

// タスク取得
router.get("/task", authMiddleware, getTask)

// タスク追加
router.post("/task", upload.single("taskImage"), authMiddleware, createTask)

// 先週のタスク
router.get("/task/prev-week", authMiddleware, getPrevWeekTask)

// 来週のタスク
router.get("/task/next-week", authMiddleware, getNextWeekTask)

export default router
