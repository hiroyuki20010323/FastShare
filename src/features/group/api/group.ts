import { User } from "firebase/auth"
import { api, CustomAxiosRequestConfig } from "../../../lib/axios"
import { GroupProfileData } from "../components/CreateGroup"
import { FormInputs } from "../components/GroupSettings"
import { Group } from "../components/Home"

export const GroupApi = {
	createGroupFromData: async (
		{ group_icon, group_name, group_description }: GroupProfileData,
		user: User | null
	) => {
		const formData = new FormData()
		formData.append("group_name", group_name)
		formData.append("group_icon", group_icon)
		formData.append("group_description", group_description)
		formData.append("uid", user?.uid || "")

		  return await api.post(`/api/group`, formData, {
			requiresAuth: false
		} as CustomAxiosRequestConfig)
    
	},

	editGroup: async (
		{ group_icon, group_name, group_description }: FormInputs,
		groupData: Group | null
	) => {
		const formData = new FormData()

		if (group_icon) {
			formData.append("group_icon", group_icon)
		}
		formData.append("group_name", group_name)
		formData.append("group_description", group_description)
		formData.append("groupId", String(groupData?.id))

		return api.patch(`/api/group-profile`, formData)
	},

	groupDelete: async (groupId: number) => {
		return api.delete(`/api/group-profile`, {
			data: { groupId },
			requiresAuth: false
		} as CustomAxiosRequestConfig)
	},
	getGroup: async () => {
		return api.get(`/api/group`)
	},
	activeGroup: async (groupId: number) => {
		return api.post(`/api/open-group`, { groupId })
	}
}
