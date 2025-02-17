import { Request, Response } from "express"
import { prisma } from "../lib/prismaClient"

// ログイン認証
export const verifyToken = (req: Request, res: Response) => {
	try {
		res
			.status(200)
			.send({ message: "ログインに成功しました！", uid: req.user.uid })
	} catch (e) {
		console.error("ログインエラー:", e)
		res
			.status(401)
			.send({ message: "ログインに失敗しました。もう一度お試しください" })
	}
}

//  メールアドレス＆パスワード登録
export const signUp = async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			res.status(400).json({ message: "ユーザーデータが存在しません。。。" })
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
}
