import { useNavigation } from "../../../hooks/useNavigation"
import { useAuthContext } from "../../../provider/AuthProvider"
import { GroupProfileData } from "../components/CreateGroup"
import { GroupApi } from "../api/group"
import { useState } from "react"
import { Group } from "../components/Home"
import { FormInputs } from "../components/GroupSettings"
import { useAlert } from "../../../provider/AlertProvider"
import { AxiosError } from "axios"
export const useGroup = () => {
	const { toHome } = useNavigation()
	const user = useAuthContext()
	const [groupData, setGroupData] = useState<Group | null>(null)
	const { showAlert } = useAlert()

	const createGroup = async ({
		group_icon,
		group_name,
		group_description
	}: GroupProfileData) => {
		try {
			const response = await GroupApi.createGroupFromData(
				{
					group_icon,
					group_name,
					group_description
				},
				user
			)
			toHome()
			showAlert(response.data.message, "success")
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert(error.response?.data?.error, "error")
			} else {
				showAlert("予期せぬエラーが発生しました", "error")
			}
		}
	}

	const groupEdit = async ({
		group_icon,
		group_name,
		group_description
	}: FormInputs) => {
		try {
			const response = await GroupApi.editGroup(
				{
					group_icon,
					group_name,
					group_description
				},
				groupData
			)
			setGroupData(response.data)
			console.log(response.data)
			showAlert(response.data.message, "success")
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert(error.response?.data?.error, "error")
			} else {
				showAlert("予期せぬエラーが発生しました", "error")
			}
		}
	}

	const groupDelete = async (groupId: number) => {
		try {
			const response = await GroupApi.groupDelete(groupId)
			toHome()
			showAlert(response.data.message, "success")
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert(error.response?.data?.error, "error")
			} else {
				showAlert("予期せぬエラーが発生しました", "error")
			}
		}
	}

	return {
		createGroup,
		groupEdit,
		groupData,
		setGroupData,
		groupDelete
	}
}

export default useGroup
