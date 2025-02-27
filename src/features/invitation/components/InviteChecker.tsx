import { Box, Button, Typography } from "@mui/material"
import axios from "axios"
import { onAuthStateChanged } from "firebase/auth"
import type { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Loading from "../../../components/Loading"
import { auth } from "../../../config/firebaseConfig"
import { useNavigation } from "../../../hooks/useNavigation"
import { useAlert } from "../../../provider/AlertProvider"
import { useLoading } from "../../../provider/LoadingProvider"
import { InvitationApi } from "../api/InvitationApi"

const InviteChecker = () => {
	const [searchParams] = useSearchParams()
	const token = searchParams.get("token")
	const [groupInfo, setGroupInfo] = useState<{
		groupId: number
		groupName: string
	} | null>(null)
	const [error, setError] = useState("")
	const [user, setUser] = useState<User | null>(null)
	const navigate = useNavigate()
	const { loading, setLoading } = useLoading()
	const { toLogin, toTask, toHome } = useNavigation()
	const { showAlert } = useAlert()

	useEffect(() => {
		setLoading(true)

		// 認証状態の監視
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser)

			// 認証状態が確定した後にトークン検証を実行
			const validateToken = async () => {
				if (!token) {
					setError("招待リンクが無効です")
					setLoading(false)
					return
				}

				try {
					const response = await InvitationApi.validateInvitation(token)
					console.log(response)

					setGroupInfo(response.data)
					setLoading(false)
				} catch (error) {
					setError("招待リンクが無効か期限切れです")
					setLoading(false)
				}
			}

			validateToken()
		})

		return () => unsubscribe()
	}, [token])

	const acceptInvitation = async () => {
		if (!token || !user) return
		try {
			setLoading(true)
			const response = await InvitationApi.acceptInvitation(token)
			showAlert(response.data.message, "success")
			toTask()
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response?.data?.error) {
				showAlert(error.response.data.error, "error")
			} else {
				showAlert("予期せぬエラーが発生しました", "error")
			}
			toHome()
		} finally {
			setLoading(false)
		}
	}

	const goToLogin = () => {
		if (token) {
			sessionStorage.setItem("inviteToken", token)
		}
		navigate(`/login?redirect=/invitechecker&token=${token}`)
	}

	const goToSignup = () => {
		if (token) {
			sessionStorage.setItem("inviteToken", token)
		}
		navigate(`/signup?redirect=/invitechecker&token=${token}`)
	}

	if (loading) return <Loading />

	if (error) {
		return (
			<Box sx={{ textAlign: "center", p: 4 }}>
				<Typography variant="h5" color="error" gutterBottom>
					{error}
				</Typography>
				<Button variant="contained" onClick={() => toLogin()}>
					ログイン画面に戻る
				</Button>
			</Box>
		)
	}

	return (
		<Box sx={{ textAlign: "center", p: 4 }}>
			<Typography variant="h4" gutterBottom>
				グループ招待
			</Typography>

			{groupInfo && (
				<Typography variant="h5" gutterBottom>
					「{groupInfo.groupName}」グループに招待されています！！！
				</Typography>
			)}

			{user ? (
				<Button
					variant="contained"
					color="primary"
					onClick={acceptInvitation}
					sx={{ mt: 2 }}
				>
					参加する
				</Button>
			) : (
				<Box sx={{ mt: 2 }}>
					<Typography variant="body1" gutterBottom>
						参加するにはログインまたは新規登録が必要です
					</Typography>
					<Button
						variant="contained"
						color="primary"
						onClick={goToLogin}
						sx={{ mt: 1 }}
					>
						ログインする
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={goToSignup}
						sx={{ mt: 1 }}
					>
						新規登録
					</Button>
				</Box>
			)}
		</Box>
	)
}

export default InviteChecker
