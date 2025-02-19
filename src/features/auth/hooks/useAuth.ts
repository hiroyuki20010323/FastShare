import { useState } from "react"
import { useNavigation } from "../../../hooks/useNavigation"
import { SignUpModalData } from "../components/SignUpModal"
import { AuthApi } from "../api/auth"
import { useLoading } from "../../../provider/LoadingProvider"
import { useAlert } from "../../../provider/AlertProvider"
import { AxiosError } from "axios"

export const useAuth = () => {
	const {loading,setLoading} = useLoading()
	const [isOpenModal, setIsOpenModal] = useState(false)
	const { toHome } = useNavigation()
	const { showAlert } = useAlert()

	const login = async (email: string, password: string) => {
		try {
			setLoading(true)
			const response = await AuthApi.emailAndPasswordLogin(email, password)
      showAlert(response.message, "success")
			toHome()
		} catch (e) {
			showAlert('パスワードまたはメールアドレスが違います',"error")
		} finally {
			setLoading(false)
		}
	}

	const handleGoogleLogin = async () => {
		try {
			const response = await AuthApi.googleAuth()
			toHome()
			showAlert( response.data.message,"success")
		} catch (error) {
			if (error instanceof AxiosError) {
        showAlert(error.response?.data?.error, 'error')
      } else {
        showAlert('予期せぬエラーが発生しました', 'error')
      }
		}
	}

	const signUp = async (email: string, password: string) => {
		try {
			setLoading(true)
			 await AuthApi.signUp(email, password)
			setLoading(false)
			setIsOpenModal(true)
			
		} catch (error) {
			if (error instanceof AxiosError) {
        showAlert(error.response?.data?.error, 'error')
      } else {
        showAlert('予期せぬエラーが発生しました', 'error')
      }
		}
	}

	const inputUserModal = async (data: SignUpModalData) => {
		setLoading(true)
		const response =await AuthApi.updateUserName(data)
		setLoading(false)
		setIsOpenModal(false)
		showAlert(response?.data.message, "success")
		toHome()
	}

	return {
		login,
		loading,
		setLoading,
		handleGoogleLogin,
		isOpenModal,
		setIsOpenModal,
		signUp,
		inputUserModal
	}
}
