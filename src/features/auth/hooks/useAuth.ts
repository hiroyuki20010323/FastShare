import { useState } from "react"
import { useNavigation } from "../../../hooks/useNavigation"
import { SignUpModalData } from "../components/SignUpModal"
import { AuthRepos } from "../api/auth"

export const useAuth = () => {
	const [authLoading, setAuthLoading] = useState(false)
	const [isOpenModal, setIsOpenModal] = useState(false)
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

	const handleGoogleLogin = async () => {
		try {
			await AuthRepos.googleAuth()
			toHome()
		} catch (error) {
			console.log(error)
		}
	}

	const signUp = async(email: string, password: string) => {
		try {
			setAuthLoading(true)
			await AuthRepos.signUp(email, password)
			setAuthLoading(false)
			setIsOpenModal(true)
		} catch (e) {
			console.log("処理がうまくいきませんでした。")
		}
	}

	const inputUserModal = async (data: SignUpModalData) => {
		setAuthLoading(true)
		await AuthRepos.updateUserName(data)
		setAuthLoading(false)
		setIsOpenModal(false)
		toHome()
	}

	return {
		login,
		authLoading,
		setAuthLoading,
		handleGoogleLogin,
		isOpenModal,
		setIsOpenModal,
		signUp,
		inputUserModal
	}
}
