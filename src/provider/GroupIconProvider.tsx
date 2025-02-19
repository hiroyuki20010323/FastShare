import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect
} from "react"
import { GroupApi } from "../features/group/api/group"

type GroupIconContextType = {
	groupIcon: string | null | undefined
	setGroupIcon: React.Dispatch<React.SetStateAction<string | null | undefined>>
}

const GroupContext = createContext<GroupIconContextType | undefined>(undefined)

export const GroupIconProvider = ({ children }: { children: ReactNode }) => {
	const [groupIcon, setGroupIcon] = useState<string | null | undefined>(null)

	useEffect(() => {
		;(async () => {
			const response = await GroupApi.getActiveGroup()
			setGroupIcon(response.data.group_icon)
		})()
	}, [])

	return (
		<GroupContext.Provider value={{ groupIcon, setGroupIcon }}>
			{children}
		</GroupContext.Provider>
	)
}

export const useGroupIconContext = () => {
	const context = useContext(GroupContext)
	if (!context) {
		throw new Error("使い方が間違っています")
	}
	return context
}
