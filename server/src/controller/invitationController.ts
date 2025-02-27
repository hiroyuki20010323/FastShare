import type { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { prisma } from "../lib/prismaClient"
import { InvitationRepo } from "../repository/invitationRepository"

export const generateInvitationLink = async (req: Request, res: Response) => {
	try {
		const { groupId } = req.body
		const userId = req.user.uid

		const invitation = await InvitationRepo.createInvitation({
			groupId,
			createdBy: userId
		})

		// 環境変数からベースURLを取得
		const baseUrl =
			process.env.NODE_ENV === "production"
				? "https://fastshare.jp"
				: "http://localhost:5173"
		const invitationLink = `${baseUrl}/invitechecker?token=${invitation.token}`

		res.status(201).json({
			message: "招待リンクを生成しました!!",
			invitationLink
		})
	} catch (e) {
		console.error("招待リンクの生成に失敗しました", e)
		res.status(500).json({ error: "招待リンクの生成に失敗しました" })
	}
}

export const validateInvitation = async (req: Request, res: Response) => {
	try {
		const { token } = req.query

		if (!token || typeof token !== "string") {
			res.status(400).json({ error: "無効なトークンです" })
			return
		}

		// ここで検証
		const invitation = await InvitationRepo.validateToken(token)

		if (!invitation) {
			res.status(404).json({ error: "招待リンクが無効か期限切れです" })
			return
		}

		res.status(200).json({
			groupId: invitation.groupId,
			groupName: invitation.group.group_name,
			group_icon: invitation.group.group_icon
		})
	} catch (e) {
		console.error("招待の検証に失敗しました", e)
		res.status(500).json({ error: "招待の検証に失敗しました" })
	}
}

export const acceptInvitation = async (req: Request, res: Response) => {
	try {
		const { token } = req.body
		const userId = req.user.uid

		if (!token) {
			res.status(400).json({ error: "トークンが必要です" })
			return
		}

		const invitation = await InvitationRepo.validateToken(token)

		if (!invitation) {
			res.status(404).json({ error: "招待リンクが無効か期限切れです" })
			return
		}

		// ユーザーが既にグループに参加しているか確認
		const existingParticipation = await prisma.participation.findFirst({
			where: {
				userId,
				groupId: invitation.groupId
			}
		})

		if (existingParticipation) {
			// 既存のグループを探して非アクティブにする
			await prisma.participation.updateMany({
				where: {
					userId,
					isActive: true
				},
				data: { isActive: false }
			})

			await prisma.participation.update({
				where: { id: existingParticipation.id },
				data: { isActive: true }
			})

			res.status(200).json({
				message: "既に参加済みのグループです"
			})
			return
		}

		// 新規参加の場合、現在参加中のグループを非アクティブにする
		await prisma.participation.updateMany({
			where: {
				userId,
				isActive: true
			},
			data: { isActive: false }
		})

		// ユーザーをグループに追加して、アクティブにする
		await prisma.participation.create({
			data: {
				id: uuidv4(),
				userId,
				groupId: invitation.groupId,
				isActive: true
			}
		})

		// トークンを使用済み
		await InvitationRepo.markTokenAsUsed(token)

		res.status(200).json({
			message: `${invitation.group.group_name}に参加しました！！`
		})
	} catch (e) {
		console.error("招待の受け入れに失敗しました", e)
		res.status(500).json({ error: "招待の受け入れに失敗しました" })
	}
}
