import { Request, Response } from "express"
import { prisma } from "../lib/prismaClient"

export const getProfile = async (req: Request, res: Response) => {
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

// プロフィール更新
export const updateProfile = async (req: Request, res: Response) => {
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
