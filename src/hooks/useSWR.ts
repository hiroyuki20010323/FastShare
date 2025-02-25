import useSWR, { mutate } from "swr"
import { API_URL } from "../config"
import { api } from "../lib/axios"

const fetcher = (url: string) =>
	api.get(`${API_URL}${url}`).then((res) => res.data)

// ユーザーアイコン取得
export const useUserIcon = () => {
	const { data } = useSWR("/api/profile", fetcher)

	return {
		userIcon: data?.fileUrl,
		mutateUserIcon: () => mutate("/api/profile")
	}
}
// グループアイコン取得
export const useGroupIcon = () => {
	const { data } = useSWR("/api/open-group", fetcher)

	return {
		groupIcon: data?.group_icon,
		mutateGroupIcon: () => mutate("/api/open-group")
	}
}
