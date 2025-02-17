import { Request, Response } from "express"
import { prisma } from "../lib/prismaClient"
import { v4 as uuidv4 } from "uuid"

// グループ作成
export const createGroup = async (req: Request, res: Response) => {
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
}

export const getGroupData = async (req: Request, res: Response) => {
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
}

// グループをアクティブにする処理
export const activeGroup = async (req: Request, res: Response) => {
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
}

// アクティブなグループデータの取得
export const getGroupProfile = async (req: Request, res: Response) => {
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
}
// グループデータの更新
export const updateGroup = async (req: Request, res: Response) => {
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

// グループの削除
export const deleteGroup = async (req: Request, res: Response) => {
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
}
