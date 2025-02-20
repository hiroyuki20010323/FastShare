import { API_URL } from "../config"
import useSWR, { mutate } from "swr"
import { api } from "../lib/axios"

const fetcher = (url: string) =>
	api.get(`${API_URL}${url}`).then((res) => res.data)

export const useUserIcon = () => {
	const { data } = useSWR("/api/profile", fetcher)

	return {
		userIcon: data?.fileUrl,
		mutateUserIcon: () => mutate("/api/profile")
	}
}

export const useGroupIcon = () => {
	const { data } = useSWR("/api/open-group", fetcher)

	return {
		groupIcon: data?.group_icon,
		mutateGroupIcon: () => mutate("/api/open-group")
	}
}
