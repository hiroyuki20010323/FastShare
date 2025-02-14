import { useNavigation } from "../../../hooks/useNavigation"
import { useAuthContext } from "../../../provider/AuthProvider"
import { GroupProfileData } from "../components/CreateGroup"
import { GroupApi } from "../api/group"
import { useState } from "react"
import { Group } from "../components/Home"
import { FormInputs } from "../components/GroupSettings"
export const useGroup = () => {
	const { toHome } = useNavigation()
	const user = useAuthContext()
	const [groupData, setGroupData] = useState<Group | null>(null)

	const createGroup = async ({
		group_icon,
		group_name,
		group_description
	}: GroupProfileData) => {
		try {
			await GroupApi.createGroupFromData(
				{
					group_icon,
					group_name,
					group_description
				},
				user
			)
			toHome()
		} catch (error) {
			console.log("アップロードに失敗しました", error)
		}
	}

	const groupEdit = async ({
		group_icon,
		group_name,
		group_description
	}: FormInputs) => {
		try {
			const patchResponse = await GroupApi.editGroup(
				{
					group_icon,
					group_name,
					group_description
				},
				groupData
			)
			setGroupData(patchResponse.data)
		} catch (e) {
			console.log("なんかのエラーが出ました", e)
		}
	}

	const groupDelete = async (groupId: number) => {
		try {
			const response = await GroupApi.groupDelete(groupId)
			alert(response.data.message)
			toHome()
		} catch (e) {
			console.log("うまく削除できませんでした", e)
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
