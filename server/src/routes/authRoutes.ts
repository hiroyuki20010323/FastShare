import { Router } from "express"
import { signUp, verifyToken } from "../controller/authController"
import { authMiddleware } from "../middleware/auth/authMiddleware"

const router = Router()
// ログイン
router.post("/verify", authMiddleware, verifyToken)

// 新規登録
router.post("/user", signUp)

export default router
