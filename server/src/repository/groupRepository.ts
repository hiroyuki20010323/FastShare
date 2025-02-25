import type { Request } from "express"
import { v4 as uuidv4 } from "uuid"
import type { MulterS3File } from "../controller/groupController"
import { prisma } from "../lib/prismaClient"

export type createGroupData = {
	group_icon: string | null
	group_name: string
	group_description?: string
}

export type ParticipationData = {
	userId: string
	groupId: number
}

export type UpdateGroupDataType = {
	group_name: string
	group_description: string | null
	groupIdInt: number
}
export const GroupRepo = {
	// グループの作成
	createGroup: async ({
		group_icon,
		group_name,
		group_description
	}: createGroupData) => {
		return await prisma.groups.create({
			data: {
				group_name,
				group_description,
				group_icon
			}
		})
	},

	// participationに作成車とグループのidを作成して、参加している状態にする
	createParticipation: async ({ userId, groupId }: ParticipationData) => {
		return await prisma.participation.create({
			data: {
				id: uuidv4(),
				userId,
				groupId
			}
		})
	},

	// グループを取得する
	getGroupDataAction: async (req: Request) => {
		return prisma.participation.findMany({
			where: { userId: req.user.uid },
			include: { group: true }
		})
	},

	//  すでにtrueの値をfalseに変える。これにより別のグループの開くボタンを押した時に現在開かれているグループをcloseする。
	deactivateUserParticipations: async (userId: string) => {
		return await prisma.participation.updateMany({
			where: { userId },
			data: { isActive: false }
		})
	},

	// グループをアクティブにする
	activeGroupAction: async ({ userId, groupId }: ParticipationData) => {
		return await prisma.participation.updateMany({
			// 複合主キーで開くグループを一意に特的する。
			where: {
				AND: [{ userId }, { groupId }]
			},
			data: { isActive: true }
		})
	},
	// アクティブなグループデータを取得
	getActiveGroupData: async (req: Request) => {
		return prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			},
			include: { group: true }
		})
	},
	//グループデータの更新
	updateGroupData: async (
		req: Request,
		{ groupIdInt, group_name, group_description }: UpdateGroupDataType
	) => {
		return prisma.groups.update({
			where: { id: groupIdInt },
			data: {
				...(req.file && { group_icon: (req.file as MulterS3File)?.location }),
				...(group_name && { group_name }),
				...(group_description !== undefined ? { group_description } : {})
			}
		})
	},
	// カスケードを設定しようとしたが、なぜかDBの権限の問題でうまく実行できなかったので、先に中間テーブルのレコードを削除した。
	preDeleteGroupParticipations: async (groupId: number) => {
		// 1. まず関連するタスクを削除
		await prisma.task.deleteMany({
			where: {
				OR: [
					{ requestor: { participation: { groupId } } },
					{ contractor: { participation: { groupId } } }
				]
			}
		})

		// 2. RequestorsとContractorsを削除
		await prisma.requestors.deleteMany({
			where: { participation: { groupId } }
		})
		await prisma.contractors.deleteMany({
			where: { participation: { groupId } }
		})

		// 3. 最後にParticipationを削除
		return await prisma.participation.deleteMany({
			where: { groupId }
		})
	},
	// グループ削除
	deleteGroupAction: async (groupId: number) => {
		await prisma.groups.delete({
			where: { id: groupId }
		})
	}
}
