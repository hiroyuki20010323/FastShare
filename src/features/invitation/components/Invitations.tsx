import { Box, TextField, Button } from "@mui/material"
import { useState } from "react"
import Footer from "../../../components/Footer"
import Header from "../../../components/Header"
import { GroupApi } from "../../group/api/group"
import { useAlert } from "../../../provider/AlertProvider"
import { InvitationApi } from "../api/InvitationApi"


const Invitations = () => {
	const [invitationLink, setInvitationLink] = useState('')
	const { showAlert } = useAlert()
	const [copied, setCopied] = useState(false)

	const generateLink = async() =>{
		try {
      const activeGroup = await GroupApi.getActiveGroup()
			
      const groupId = activeGroup.data.id
			
      const response = await InvitationApi.generateInvitation(groupId)
      setInvitationLink(response.data.invitationLink)
      showAlert('招待リンクを生成しました', 'success')
    } catch (error) {
      showAlert('招待リンクの生成に失敗しました', 'error')
    } 
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(invitationLink)
			.then(() => {
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			})
			.catch(err => {
				console.error('クリップボードへのコピーに失敗しました', err)
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
				<TextField
					id="outlined-disabled"
					label="招待リンク"
					value={invitationLink}
					sx={{ width: 300, marginTop: 40 }}
				/>
				<Button variant="contained" sx={{ width: 300, marginTop: 4 }} onClick={generateLink}>
					リンクを生成する
				</Button>

				<Button 
					variant="contained" 
					sx={{ width: 300, marginTop: 4 }}
					onClick={copyToClipboard}
				>
					{copied ? 'コピーしました' : '招待リンクをコピー'}
				</Button>
			</Box>
			<Footer />
		</>
	)
}

export default Invitations
