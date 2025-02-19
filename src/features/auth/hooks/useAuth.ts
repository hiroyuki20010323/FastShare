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
			showAlert( response,"success")
		} catch (error:AxiosError|any) {
			console.log(error)
			showAlert(error.response.data.error ,"error")
		}
	}

	const signUp = async (email: string, password: string) => {
		try {
			setLoading(true)
			 await AuthApi.signUp(email, password)
			setLoading(false)
			setIsOpenModal(true)
			
		} catch (error: AxiosError | any) {
			console.log("処理がうまくいきませんでした。")
			showAlert( "登録に失敗しました...","error")
		}
	}

	const inputUserModal = async (data: SignUpModalData) => {
		setLoading(true)
		const response =await AuthApi.updateUserName(data)
		setLoading(false)
		setIsOpenModal(false)
		showAlert(response, "success")
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
