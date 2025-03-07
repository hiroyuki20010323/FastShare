import type { Request, Response } from "express"
import { AuthRepo } from "../repository/authRepository"

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
			.send({ error: "ログインに失敗しました。もう一度お試しください" })
	}
}

//  メールアドレス＆パスワード登録
export const signUp = async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			res.status(400).json({ message: "ユーザーデータが存在しません。。。" })
		}
		const { uid: id, displayName: user_name, icon_url, photoURL } = req.body
		const resolvedIconUrl = icon_url || photoURL

		const existingUser = await AuthRepo.findUser(id)

		// googleログインで既にデータがある場合、return
		if (existingUser) {
			res.status(200).json({ message: "ログインに成功しました！" })
			return
		}

		await AuthRepo.createUser({ id, user_name, icon_url: resolvedIconUrl })

		res.status(201).json({ message: "ユーザーの登録に成功しました。" })
	} catch (e) {
		res.status(500).json({ error: "ユーザー登録に失敗しました" })
	}
}
