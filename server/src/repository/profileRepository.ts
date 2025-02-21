import { Request } from "express"
import { prisma } from "../lib/prismaClient"
import { MulterS3File } from "../controller/groupController"

export const ProfileRepo = {
	// プロフィール情報の取得
	getProfileData: async (req: Request) => {
		return await prisma.users.findUnique({
			where: { id: req.user.uid }
		})
	},

	// プロフィールのアップデート
	updateProfileData: async (req: Request, user_name: string) => {
		return await prisma.users.update({
			where: { id: req.user.uid },
			data: {
				...(user_name && { user_name }),
				...(req.file && { icon_url: (req.file as MulterS3File)?.location })
			}
		})
	}
}
