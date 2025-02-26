import type { Request, Response } from "express"
import { InvitationRepo } from "../repository/invitationRepository"
import { prisma } from "../lib/prismaClient"
import { v4 as uuidv4 } from "uuid"

export const generateInvitationLink = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.body
    const userId = req.user.uid
    
    // アクティブなグループかどうか確認するロジックを追加するとよい
    
    const invitation = await InvitationRepo.createInvitation({
      groupId,
      createdBy: userId
    })
    
    // フロントエンドで使用するための完全なURLを生成
    const baseUrl = 'http://localhost:5173';
    const invitationLink = `${baseUrl}/invitechecker?token=${invitation.token}`
    
    res.status(201).json({
      message: "招待リンクを生成しました",
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
    
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: "無効なトークンです" })
      return 
    }
    
    const invitation = await InvitationRepo.validateToken(token)
    
    if (!invitation) {
      res.status(404).json({ error: "招待リンクが無効か期限切れです" })
      return 
    }
    
    // グループ情報を返す
    res.status(200).json({
      valid: true,
      groupId: invitation.groupId,
      groupName: invitation.group.group_name
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
    
    // ユーザーをグループに追加
    await prisma.participation.create({
      data: {
        id: uuidv4(),
        userId,
        groupId: invitation.groupId
      }
    })
    
    // トークンを使用済みにする
    await InvitationRepo.markTokenAsUsed(token)
    
    res.status(200).json({
      message: "グループに参加しました",
      groupId: invitation.groupId
    })
  } catch (e) {
    console.error("招待の受け入れに失敗しました", e)
    res.status(500).json({ error: "招待の受け入れに失敗しました" })
  }
}