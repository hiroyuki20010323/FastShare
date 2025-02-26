import { v4 as uuidv4 } from "uuid"
import { prisma } from "../lib/prismaClient"

export type CreateInvitationData = {
  groupId: number
  createdBy: string
  expiresIn?: number // 有効期限（時間単位、デフォルト24時間）
}

export const InvitationRepo = {
  // 招待リンクの作成
  createInvitation: async ({ groupId, createdBy, expiresIn = 24 }: CreateInvitationData) => {
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + expiresIn)
    
    return await prisma.invitation.create({
      data: {
        id: uuidv4(),
        token,
        groupId,
        createdBy,
        expiresAt
      }
    })
  },
  
  // トークンの検証
  validateToken: async (token: string) => {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { group: true }
    })
    
    if (!invitation) return null
    if (invitation.isUsed) return null
    if (invitation.expiresAt < new Date()) return null
    
    return invitation
  },
  
  // トークンを使用済みにする
  markTokenAsUsed: async (token: string) => {
    return await prisma.invitation.update({
      where: { token },
      data: { isUsed: true }
    })
  }
}