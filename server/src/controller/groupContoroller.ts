import { Request, Response } from "express"
import { prisma } from "../lib/prismaClient"
import { GroupRepo } from "../repository/groupRepository"

export type MulterS3File = Express.Multer.File & {
	location: string
}

// グループ作成
export const createGroup = async (req: Request, res: Response) => {
	try {
		const group_icon = (req.file as MulterS3File)?.location
		const { group_name, group_description } = req.body

		const newGroup = await GroupRepo.createGroup({
			group_icon,
			group_name,
			group_description
		})

		const userId = req.body.uid
		const groupId = newGroup.id

		await GroupRepo.createParticipation({ userId, groupId })

		res.status(201).json({
			message: "グループの作成に成功しました。"
		})
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: "グループの作成に失敗しました。もう一度お試しください"
		})
	}
}

// グループデータの取得
export const getGroupData = async (req: Request, res: Response) => {
	try {
		const participations = await GroupRepo.getGroupDataAction(req)
		const groups = participations.map((participations) => participations.group)
		res.status(201).json(groups)
	} catch (e) {
		res.status(500).json({
			message: "グループ情報を取得できませんでした。"
		})
	}
}

// グループをアクティブにする処理
export const activeGroup = async (req: Request, res: Response) => {
	try {
		const { groupId } = req.body
		const userId = req.user.uid

		await GroupRepo.deactivateUserParticipations(userId)

		await GroupRepo.activeGroupAction({ groupId, userId })
		res.status(201).json({ message: "グループを開きました！！" })
	} catch (e) {
		console.log(e)
		res.status(500).json({ message: "グループひらけませんでした。。。" })
	}
}

// アクティブなグループプロフィールの取得
export const getGroupProfile = async (req: Request, res: Response) => {
	try {
		const activeGroup = await GroupRepo.getActiveGroupData(req)
		res.status(201).json(activeGroup?.group)
	} catch (e) {
		res.status(500).json({ message: "グループデータの取得に失敗しました" })
	}
}
// グループデータの更新
export const updateGroup = async (req: Request, res: Response) => {
	try {
		const { group_name, group_description, groupId } = req.body
		const groupIdInt = parseInt(groupId, 10)
		//  フロントからのFormDataは文字列でidが送信されてくるのでIntに変換する

		const updateGroup = await GroupRepo.updateGroupData(req, {
			group_name,
			group_description,
			groupIdInt
		})
		res.status(201).json(updateGroup)
	} catch (e) {
		res
			.status(500)
			.json({ message: "グループプロフィールの更新に失敗しました。" })
	}
}

// グループの削除
export const deleteGroup = async (req: Request, res: Response) => {
	try {
		// カスケードを設定しようとしたが、なぜかDBの権限の問題でうまく実行できなかったので、先に中間テーブルのレコードを削除した。
		const groupId = req.body.groupId

		await GroupRepo.preDeleteGroupParticipations(groupId)
		await GroupRepo.deleteGroupAction(groupId)
		res.status(200).json({ message: "グループが削除されました。" })
	} catch (e) {
		res
			.status(500)
			.json({ message: `サーバー側で削除がうまく実行できませんでした`, e })
	}
}
