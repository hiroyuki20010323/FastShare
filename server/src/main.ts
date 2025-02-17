import express, { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import cors from "cors"
import { S3Client } from "@aws-sdk/client-s3"
import multer from "multer"
import multerS3 from "multer-s3"
import { v4 as uuidv4 } from "uuid"
import admin from "firebase-admin"
import { startOfDay, addDays } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { authMiddleware } from "./middleware/auth/authMiddleware"

const prisma = new PrismaClient()
const app = express()
const PORT = 3080

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const s3 = new S3Client({
	region: process.env.AWS_REGION || "",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
	}
})

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.S3_BUCKET_NAME!,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname })
		},
		key: function (req, file, cb) {
			const uniqueFileName = `${uuidv4()}-${file.originalname}`
			// TODOuserIconというパスに画像関係を全てアップロードしてしまっているため、あとでパスを切る
			const filePath = `userIcon/${uniqueFileName}`
			cb(null, filePath)
		}
	})
})

app.get("/", (req, res) => {
	res.status(200).send("Hello Fast Share!!!!")
})

app.post("/auth/verify", authMiddleware, async (req, res) => {
	try {
		res.status(200).send({ message: "トークンが有効です", uid: req.user.uid })
	} catch (e) {
		res.status(401).send("無効なトークンです")
	}
})

// メールアドレスとパスワード新規登録
app.post("/api/user", async (req, res) => {
	try {
		if (!req.body) {
			console.log("データが存在しません")
			res.status(400).json({ error: "ユーザーデータが存在しません。。。" })
		}

		const id = req.body.uid
		const userName = req.body.displayName
		const iconData = req.body.icon_url || req.body.photoURL

		const existingUser = await prisma.users.findUnique({
			where: { id }
		})

		if (existingUser) {
			res.status(200).json({ message: "ユーザーは既に存在します" })
			return
		}

		await prisma.users.create({
			data: {
				id,
				user_name: userName,
				icon_url: iconData
			}
		})
		res.status(201).json({ message: "ユーザーの登録に成功しました。" })
	} catch (e) {
		res.status(500).json({ error: "データの保存に失敗しました" })
	}
})

// プロフィール情報取得
app.get(
	"/api/profile",
	authMiddleware,
	async (req: Request, res: Response): Promise<void> => {
		try {
			const user = await prisma.users.findUnique({
				where: { id: req.user.uid }
			})
			if (!user) {
				res.status(400).json({ error: "ユーザー情報を取得できませんでした" })
				return
			}
			res.json({
				newUserName: user.user_name,
				fileUrl: user.icon_url,
				message: "取得成功"
			})
		} catch (e) {
			res.status(500).json({ error: "サーバーエラー" })
		}
	}
)

// プロフィール情報の更新
app.patch(
	"/api/profile",
	authMiddleware,
	upload.single("icon_url"),
	async (req, res) => {
		try {
			const { user_name } = req.body
			const updatedUser = await prisma.users.update({
				where: { id: req.user.uid },
				data: {
					...(user_name && { user_name }),
					...(req.file && { icon_url: (req.file as any)?.location })
				}
			})
			res.status(201).json(updatedUser)
		} catch (e) {
			res.status(500).json({ error: "ユーザーの更新に失敗しました。" })
		}
	}
)

// グループの作成
app.post("/api/group", upload.single("group_icon"), async (req, res) => {
	try {
		const groupIcon = (req.file as any)?.location
		const group_name = req.body.group_name
		const group_description = req.body.group_description
		const newGroup = await prisma.groups.create({
			data: {
				group_name,
				group_description,
				group_icon: groupIcon
			}
		})
		await prisma.participation.create({
			data: {
				id: uuidv4(),
				userId: req.body.uid,
				groupId: newGroup.id
			}
		})
		res.status(201).json({
			message: "グループの作成に成功しました。"
		})
	} catch (e) {
		res.json({
			message: "データが送信されていません"
		})
	}
})

// グループ一覧取得
app.get("/api/group", authMiddleware, async (req, res) => {
	try {
		const participations = await prisma.participation.findMany({
			where: { userId: req.user.uid },
			include: { group: true }
		})
		const groups = participations.map((participations) => participations.group)
		res.status(201).json(groups)
	} catch (e) {
		res.status(500).json({
			message: "グループ情報を取得できませんでした。"
		})
	}
})

// グループを開く処理
app.post("/api/open-group", authMiddleware, async (req, res) => {
	try {
		const { groupId } = req.body
		//  下記すでにtrueの値をfalseに変える。これにより別のグループの開くボタンを押した時に現在開かれているグループをcloseする。
		await prisma.participation.updateMany({
			where: { userId: req.user.uid },
			data: { isActive: false }
		})
		await prisma.participation.updateMany({
			// 複合主キーで開くグループを一意に特的する。
			where: {
				AND: [{ userId: req.user.uid }, { groupId }]
			},
			data: { isActive: true }
		})
		res.status(201).json({ message: "グループを開きました！！" })
	} catch (e) {
		res.status(500).json({ message: "グループひらけませんでした。。。" })
	}
})

// グループのプロフィールを取得する
app.get("/api/open-group", authMiddleware, async (req, res) => {
	try {
		const activeGroup = await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			},
			include: { group: true }
		})
		res.status(201).json(activeGroup?.group)
	} catch (e) {
		res.status(500).json("処理に失敗しました。")
	}
})

// グループのプロフィールを更新する処理
app.patch(
	"/api/group-profile",
	authMiddleware,
	upload.single("group_icon"),
	async (req, res) => {
		try {
			const { group_name, group_description, groupId } = req.body
			const groupIdInt = parseInt(groupId, 10)
			//  フロントからのFormDataは文字列でidが送信されてくるのでIntに変換する

			const updateGroup = await prisma.groups.update({
				where: { id: groupIdInt },
				data: {
					...(req.file && { group_icon: (req.file as any)?.location }),
					...(group_name && { group_name }),
					...(group_description && { group_description })
				}
			})
			res.status(201).json(updateGroup)
		} catch (e) {
			res
				.status(500)
				.json({ error: "グループプロフィールの更新に失敗しました。" })
		}
	}
)

// グループを削除する処理
app.delete("/api/group-profile", async (req, res) => {
	try {
		// カスケードを設定しようとしたが、なぜかDBの権限の問題でうまく実行できなかったので、先に中間テーブルのレコードを削除した。
		await prisma.participation.deleteMany({
			where: { groupId: req.body.groupId }
		})
		await prisma.groups.delete({
			where: { id: req.body.groupId }
		})
		res.status(200).json({ message: "グループが削除されました。" })
	} catch (e) {
		res
			.status(500)
			.json({ message: `サーバー側で削除がうまく実行できませんでした`, e })
	}
})

// タスクの取得
app.get("/api/task", authMiddleware, async (req, res) => {
	try {
		const activeParticipation = await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			}
		})

		if (!activeParticipation) {
			res
				.status(404)
				.json({ message: "アクティブなグループが見つかりません。" })
			return
		}

		const activeGroupId = activeParticipation.groupId

		const timeZone = "Asia/Tokyo"
		const todayJST = startOfDay(toZonedTime(new Date(), timeZone))

		const oneWeekLaterJST = addDays(todayJST, 6)

		const tasks = await prisma.calendar.findMany({
			where: {
				date: {
					gte: todayJST,
					lte: oneWeekLaterJST
				}
			},
			select: {
				id: true,
				date: true,
				tasks: {
					where: {
						participationCreatedGroupId: activeGroupId
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						createdUser: {
							select: {
								user: {
									select: {
										id: true,
										user_name: true,
										icon_url: true
									}
								}
							}
						}
					}
				}
			},
			orderBy: {
				date: "asc"
			}
		})

		res.status(200).json(tasks)
	} catch (e) {
		console.log("タスクデータの取得失敗しました。", e)
	}
})

// タスクの追加
app.post(
	"/api/task",
	authMiddleware,
	upload.single("taskImage"),
	async (req, res) => {
		try {
			const activeParticipation = await prisma.participation.findFirst({
				where: {
					userId: req.user.uid,
					isActive: true
				}
			})

			if (!activeParticipation) {
				res
					.status(404)
					.json({ message: "アクティブなグループが見つかりません。" })
				return
			}

			const activeGroupId = activeParticipation.groupId

			const { taskTitle, taskDetail, dueDate, dueTime } = req.body

			const period = new Date(`${dueDate}T${dueTime || "00:00"}:00`)

			const calenderDate = new Date(`${dueDate}T00:00:00`)
			try {
				const calender = await prisma.calendar.findUnique({
					where: { date: calenderDate }
				})

				const task = await prisma.task.create({
					data: {
						taskTitle,
						taskDetail,
						...(req.file && { taskImageUrl: (req.file as any)?.location }),
						period,
						participationCreatedUserId: req.user.uid,
						participationCreatedGroupId: activeGroupId,
						calendarId: calender!.id
					}
				})

				res.status(201).json({ message: "タスクが作成されました", task })
			} catch (e) {
				res
					.status(500)
					.json({ message: "指定された日にタスクは追加できません" })
			}
		} catch (e) {
			console.log("タスクの投稿に失敗しました。", e)
		}
	}
)

// 先週のタスクを取得する
app.get("/api/task/prev-week", authMiddleware, async (req, res) => {
	try {
		const activeParticipation = await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			}
		})

		if (!activeParticipation) {
			res
				.status(404)
				.json({ message: "アクティブなグループが見つかりません。" })
			return
		}

		const activeGroupId = activeParticipation.groupId
		const timeZone = "Asia/Tokyo"
		const currentDate = req.query.date
			? new Date(String(req.query.date))
			: new Date()
		const endDate = startOfDay(toZonedTime(addDays(currentDate, -1), timeZone))
		const startDate = addDays(endDate, -6)

		const tasks = await prisma.calendar.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate
				}
			},
			select: {
				id: true,
				date: true,
				tasks: {
					where: {
						participationCreatedGroupId: activeGroupId
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						createdUser: {
							select: {
								user: {
									select: {
										id: true,
										user_name: true,
										icon_url: true
									}
								}
							}
						}
					}
				}
			},
			orderBy: {
				date: "asc"
			}
		})

		res.status(200).json(tasks)
	} catch (e) {
		console.log("前週のタスクデータの取得に失敗しました。", e)
		res.status(500).json({ error: "データの取得に失敗しました" })
	}
})

// 来週のデータを取得する
app.get("/api/task/next-week", authMiddleware, async (req, res) => {
	try {
		const activeParticipation = await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			}
		})

		if (!activeParticipation) {
			res
				.status(404)
				.json({ message: "アクティブなグループが見つかりません。" })
			return
		}

		const activeGroupId = activeParticipation.groupId
		const timeZone = "Asia/Tokyo"
		const currentDate = req.query.date
			? new Date(String(req.query.date))
			: new Date()
		const startDate = startOfDay(toZonedTime(addDays(currentDate, 1), timeZone))
		const endDate = addDays(startDate, 6)

		const tasks = await prisma.calendar.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate
				}
			},
			select: {
				id: true,
				date: true,
				tasks: {
					where: {
						participationCreatedGroupId: activeGroupId
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						createdUser: {
							select: {
								user: {
									select: {
										id: true,
										user_name: true,
										icon_url: true
									}
								}
							}
						}
					}
				}
			},
			orderBy: {
				date: "asc"
			}
		})

		res.status(200).json(tasks)
	} catch (e) {
		res.status(500).json({ error: "データの取得に失敗しました" })
	}
})

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`)
})
