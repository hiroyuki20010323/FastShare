import { Router } from "express"
import {
	acceptInvitation,
	generateInvitationLink,
	validateInvitation
} from "../controller/invitationController"
import { authMiddleware } from "../middleware/auth/authMiddleware"

const router = Router()

// 招待リンクの生成（認証必須）
router.post("", authMiddleware, generateInvitationLink)

// 招待リンクの検証（認証不要）
router.get("/validate", validateInvitation)

// 招待受け入れ（認証必須）
router.post("/accept", authMiddleware, acceptInvitation)

export default router
