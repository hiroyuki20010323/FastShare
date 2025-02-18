import { Router } from "express"
import { authMiddleware } from "../middleware/auth/authMiddleware"
import { getProfile, updateProfile } from "../controller/profileController"
import { upload } from "../middleware/fileUploadMiddleware"

const router = Router()

// プロフィール取得
router.get("/profile", authMiddleware, getProfile)

// プロフィール更新
router.patch(
	"/profile",
	upload.single("icon_url"),
	authMiddleware,
	updateProfile
)

export default router
