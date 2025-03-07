import { api } from "../../../lib/axios"
import type { UserProfileData } from "../components"

export const ProfileApi = {
	patchProfile: async ({ userName, userIcon }: UserProfileData) => {
		const formData = new FormData()
		formData.append("user_name", userName)
		if (userIcon) {
			formData.append("icon_url", userIcon)
		}
		return await api.patch(`/api/profile`, formData)
	},
	getProfile: async () => {
		return await api.get(`/api/profile`)
	}
}
