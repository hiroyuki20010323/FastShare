import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect
} from "react"
import { ProfileApi } from "../features/profile/api/profile"

type ProfileIconContextType = {
	profileIcon: string | undefined
	setProfileIcon: React.Dispatch<React.SetStateAction<string | undefined>>
}

const ProfileContext = createContext<ProfileIconContextType | undefined>(
	undefined
)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
	const [profileIcon, setProfileIcon] = useState<string | undefined>(undefined)

	useEffect(() => {
		;(async () => {
			const response = await ProfileApi.getProfile()
			setProfileIcon(response.data.fileUrl)
		})()
	}, [])

	return (
		<ProfileContext.Provider value={{ profileIcon, setProfileIcon }}>
			{children}
		</ProfileContext.Provider>
	)
}

export const useProfileContext = () => {
	const context = useContext(ProfileContext)
	if (!context) {
		throw new Error("使い方が間違っています")
	}
	return context
}
