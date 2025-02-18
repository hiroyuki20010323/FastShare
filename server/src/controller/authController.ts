import { Request, Response } from "express"
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
			.send({ message: "ログインに失敗しました。もう一度お試しください" })
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

		if (existingUser) {
			res.status(200).json({ message: "ユーザーは既に存在します" })
			return
		}

		await AuthRepo.createUser({ id, user_name, icon_url: resolvedIconUrl })

		res.status(201).json({ message: "ユーザーの登録に成功しました。" })
	} catch (e) {
		res.status(500).json({ error: "データの保存に失敗しました" })
	}
}
