import {
	AppBar,
	Box,
	Button,
	Toolbar,
	Typography,
	Stack,
	Avatar
} from "@mui/material"
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
import GroupAddIcon from "@mui/icons-material/GroupAdd"

const InviteChecker = () => {
	const [searchParams] = useSearchParams()
	const token = searchParams.get("token")
	const [groupInfo, setGroupInfo] = useState<{
		groupId: number
		groupName: string
		group_icon: string | null
		group_description: string | null
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
				<AppBar
					elevation={0}
					sx={{
						width: "100vw",
						top: 0,
						height: "68px",
						backgroundColor: "white",
						pb: 0.6,
						boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.06)",
						position: "fixed"
					}}
				>
					<Toolbar
						sx={{
							marginTop: 2,
							display: "flex",
							alignItems: "center",
							position: "relative"
						}}
					>
						<Typography
							variant="h6"
							component="div"
							color="black"
							sx={{
								position: "absolute",
								left: "50%",
								transform: "translateX(-50%)"
							}}
						>
							FastShare
						</Typography>
					</Toolbar>
				</AppBar>
				<Typography variant="h5" color="error" gutterBottom sx={{ mt: 14 }}>
					{error}
				</Typography>

				{error && (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							mt: 6,
							fontSize: "0.85rem"
						}}
					>
						グループ管理者に新しい招待リンクの再作成を依頼してください。
					</Typography>
				)}

				<Button
					variant="contained"
					sx={{ mt: 20, height: 40 }}
					onClick={() => toLogin()}
				>
					ログイン画面に戻る
				</Button>
			</Box>
		)
	}

	return (
		<>
			<Box sx={{ textAlign: "center", p: 4 }}>
				<AppBar
					elevation={0}
					sx={{
						width: "100vw",
						top: 0,
						height: "68px",
						backgroundColor: "white",
						pb: 0.6,
						boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.06)",
						position: "fixed"
					}}
				>
					<Toolbar
						sx={{
							marginTop: 2,
							display: "flex",
							alignItems: "center",
							position: "relative"
						}}
					>
						<Typography
							variant="h6"
							component="div"
							color="black"
							sx={{
								position: "absolute",
								left: "50%",
								transform: "translateX(-50%)"
							}}
						>
							FastShare
						</Typography>
					</Toolbar>
				</AppBar>

				{groupInfo && (
					<>
						<Box
							sx={{
								backgroundColor: "rgba(33, 150, 243, 0.08)",
								borderRadius: 2,
								p: 4,
								mb: 4,
								mt: 14,
								boxShadow: "4px 4px 8px rgba(0,0,0,0.3)",
								transition: "transform 0.2s, box-shadow 0.2s",
								"&:hover": {
									transform: "translateY(-2px)",
									boxShadow: "6px 6px 12px rgba(0, 0, 0, 0.25)"
								}
							}}
						>
							<Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
								<Avatar
									src={groupInfo.group_icon || undefined}
									alt={`${groupInfo.groupName}のアイコン`}
									sx={{
										width: 80,
										height: 80,
										border: "2px solid rgba(33, 150, 243, 0.3)",
										boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
									}}
								/>
							</Box>

							<Stack
								direction="row"
								spacing={2}
								justifyContent="center"
								alignItems="center"
							>
								<Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
									{groupInfo.groupName}
								</Typography>
							</Stack>
						</Box>

						<Box sx={{ mt: 8, mb: 4, textAlign: "center" }}>
							<Typography
								variant="body2"
								sx={{
									opacity: 0.9,
									color: "text.primary",
									fontStyle: "normal"
								}}
							>
								✉️ グループ招待が届きました
								<br />
								参加して一緒に共有を始めましょう! 🎉
							</Typography>
						</Box>
					</>
				)}

				{user ? (
					<Button
						variant="contained"
						color="primary"
						onClick={acceptInvitation}
						size="large"
						startIcon={<GroupAddIcon />}
						sx={{ mt: 2, px: 4, py: 1 }}
					>
						参加する
					</Button>
				) : (
					<Box
						sx={{
							mt: 12,
							display: "flex",
							flexDirection: "column",
							alignItems: "center"
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={goToLogin}
							sx={{
								mt: 1,
								mb: 4,
								width: "200px",
								height: "48px"
							}}
						>
							ログイン
						</Button>
						<Button
							variant="outlined"
							color="primary"
							onClick={goToSignup}
							sx={{
								width: "200px",
								height: "48px"
							}}
						>
							新規登録
						</Button>
						<Typography
							variant="subtitle1"
							fontSize="0.8rem"
							gutterBottom
							sx={{
								mt: 6,
								color: "text.secondary"
							}}
						>
							※ 参加するにはログインまたは新規登録が必要です
						</Typography>
					</Box>
				)}
			</Box>
		</>
	)
}

export default InviteChecker
