import { Request, Response } from "express"
import { ProfileRepo } from "../repository/profileRepository"
// プロフィールデータ取得
export const getProfile = async (req: Request, res: Response) => {
	try {
		const user = await ProfileRepo.getProfileData(req)
		if (!user) {
			res.status(400).json({ error: "ユーザー情報を取得できませんでした" })
			return
		}
		res.json({
			newUserName: user.user_name,
			fileUrl: user.icon_url
		})
	} catch (e) {
		res.status(500).json({ error: "サーバーエラー" })
	}
}

// プロフィール更新
export const updateProfile = async (req: Request, res: Response) => {
	try {
		const { user_name } = req.body
		const updatedUser = await ProfileRepo.updateProfileData(req, user_name)
		res.status(201).json(updatedUser)
	} catch (e) {
		res.status(500).json({ error: "ユーザーの更新に失敗しました。" })
	}
}
