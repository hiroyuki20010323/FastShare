import { Router } from "express"
import { authMiddleware } from "../middleware/auth/authMiddleware"
import {
	activeGroup,
	createGroup,
	deleteGroup,
	getGroupData,
	getGroupProfile,
	updateGroup
} from "../controller/groupController"
import { upload } from "../middleware/fileUploadMiddleware"

const router = Router()
// グループの作成
router.post("/group", upload.single("group_icon"), createGroup)

// グループ一覧取得
router.get("/group", authMiddleware, getGroupData)

// グループを開く処理
router.post("/open-group", authMiddleware, activeGroup)

// グループのプロフィールを取得する
router.get("/open-group", authMiddleware, getGroupProfile)

// グループのプロフィールを更新する処理
router.patch(
	"/group-profile",
	upload.single("group_icon"),
	authMiddleware,
	updateGroup
)

// グループを削除する処理
router.delete("/group-profile", deleteGroup)

export default router
