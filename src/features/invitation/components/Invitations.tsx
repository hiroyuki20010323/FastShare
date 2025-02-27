import { Box, Button, Skeleton, TextField } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import Footer from "../../../components/Footer"
import Header from "../../../components/Header"
import { useAlert } from "../../../provider/AlertProvider"
import { useLoading } from "../../../provider/LoadingProvider"
import { GroupApi } from "../../group/api/group"
import { InvitationApi } from "../api/InvitationApi"

const Invitations = () => {
	const { loading, setLoading } = useLoading()
	const [invitationLink, setInvitationLink] = useState("")
	const { showAlert } = useAlert()
	const [copied, setCopied] = useState(false)

	const generateLink = async () => {
		try {
			setLoading(true)
			const activeGroup = await GroupApi.getActiveGroup()
			const groupId = activeGroup.data.id
			const response = await InvitationApi.generateInvitation(groupId)
			setInvitationLink(response.data.invitationLink)
			showAlert(response.data.message, "success")
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response?.data?.error) {
				showAlert(error.response.data.error, "error")
			} else {
				showAlert("予期せぬエラーが発生しました", "error")
			}
		} finally {
			setLoading(false)
		}
	}

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(invitationLink)
			.then(() => {
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			})
			.catch((err) => {
				console.error("コピーに失敗しました", err)
				showAlert("リンクのコピーに失敗しました", "error")
			})
	}

	return (
		<>
			<Header />

			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					flexFlow: "column",
					paddingTop: "80px",
					paddingBottom: "80px"
				}}
			>
				{loading ? (
					<Skeleton
						variant="rectangular"
						width={300}
						height={56}
						sx={{ marginTop: 40 }}
					/>
				) : (
					<TextField
						id="outlined-disabled"
						label="招待リンク"
						value={invitationLink}
						sx={{ width: 300, marginTop: 40 }}
					/>
				)}

				<Button
					variant="contained"
					sx={{ width: 300, marginTop: 4 }}
					onClick={generateLink}
				>
					リンクを生成
				</Button>

				{invitationLink && (
					<Button
						variant="contained"
						sx={{ width: 300, marginTop: 4 }}
						onClick={copyToClipboard}
					>
						{copied ? "コピーしました!!" : "リンクをコピー"}
					</Button>
				)}
			</Box>
			<Footer />
		</>
	)
}

export default Invitations
