import express, { Request, Response } from "express"
import cors from "cors"
import { authMiddleware } from "./middleware/auth/authMiddleware"
import { upload } from "./middleware/fileUploadMiddleware"
import { signUp, verifyToken } from "./controller/authController"
import { getProfile, updateProfile } from "./controller/profileController"
import {
	activeGroup,
	createGroup,
	deleteGroup,
	getGroupData,
	getGroupProfile,
	updateGroup
} from "./controller/groupContoroller"
import {
	createTask,
	getNextWeekTask,
	getPrevWeekTask,
	getTask
} from "./controller/taskController"

const app = express()
const PORT = 3080

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ヘルスチェック用
app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Hello Fast Share!!!!")
})

// ログイン
app.post("/auth/verify", authMiddleware, (req: Request, res: Response) => {
	verifyToken(req, res)
})

// メールアドレスとパスワード新規登録
app.post("/api/user", (req: Request, res: Response) => {
	signUp(req, res)
})

// プロフィール情報取得
app.get("/api/profile", authMiddleware, (req: Request, res: Response): void => {
	getProfile(req, res)
})

// プロフィール情報の更新
app.patch(
	"/api/profile",
	authMiddleware,
	upload.single("icon_url"),
	async (req: Request, res: Response) => {
		updateProfile(req, res)
	}
)

// グループの作成
app.post(
	"/api/group",
	upload.single("group_icon"),
	async (req: Request, res: Response) => {
		createGroup(req, res)
	}
)

// グループ一覧取得
app.get("/api/group", authMiddleware, (req: Request, res: Response) => {
	getGroupData(req, res)
})

// グループを開く処理
app.post(
	"/api/open-group",
	authMiddleware,
	async (req: Request, res: Response) => {
		activeGroup(req, res)
	}
)

// グループのプロフィールを取得する
app.get(
	"/api/open-group",
	authMiddleware,
	async (req: Request, res: Response) => {
		getGroupProfile(req, res)
	}
)

// グループのプロフィールを更新する処理
app.patch(
	"/api/group-profile",
	authMiddleware,
	upload.single("group_icon"),
	async (req: Request, res: Response) => {
		updateGroup(req, res)
	}
)

// グループを削除する処理
app.delete("/api/group-profile", async (req: Request, res: Response) => {
	deleteGroup(req, res)
})

// タスクの取得
app.get("/api/task", authMiddleware, async (req: Request, res: Response) => {
	getTask(req, res)
})

// タスクの追加
app.post(
	"/api/task",
	authMiddleware,
	upload.single("taskImage"),
	async (req: Request, res: Response) => {
		createTask(req, res)
	}
)

// 先週のタスクを取得する
app.get(
	"/api/task/prev-week",
	authMiddleware,
	async (req: Request, res: Response) => {
		getPrevWeekTask(req, res)
	}
)

// 来週のデータを取得する
app.get(
	"/api/task/next-week",
	authMiddleware,
	async (req: Request, res: Response) => {
		getNextWeekTask(req, res)
	}
)

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`)
})
