import { useState } from "react"
import { useNavigation } from "../../../hooks/useNavigation"
import { AuthRepos } from "../api/auth"

export const useLogin = () => {
	const [authLoading, setAuthLoading] = useState(false)
	const { toHome } = useNavigation()
	const login = async (email: string, password: string) => {
		try {
			setAuthLoading(true)
			await AuthRepos.emailAndPasswordLogin(email, password)
			toHome()
		} catch (e) {
			alert("IDまたはPassWordが違います")
		} finally {
			setAuthLoading(false)
		}
	}
	return { login, authLoading }
}
