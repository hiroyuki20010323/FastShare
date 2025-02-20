import { prisma } from "../lib/prismaClient"

export type UserData = {
	id: string
	user_name: string
	icon_url: string | null
}

export const AuthRepo = {
	// ユーザーの特定
	findUser: async (id: string) => {
		return await prisma.users.findUnique({
			where: { id }
		})
	},
	// 新規ユーザーの作成。ユーザーネームがnllなので、ポップアップで入力されたユーザーネームのinsertをする
	createUser: async ({ id, user_name, icon_url }: UserData) => {
		return await prisma.users.create({
			data: {
				id,
				user_name,
				icon_url
			}
		})
	}
}
