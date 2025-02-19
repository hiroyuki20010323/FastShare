import { Router } from "express"
import { authMiddleware } from "../middleware/auth/authMiddleware"
import { signUp, verifyToken } from "../controller/authController"

const router = Router()
// ログイン
router.post("/verify", authMiddleware, verifyToken)

// 新規登録
router.post("/user", signUp)

export default router
