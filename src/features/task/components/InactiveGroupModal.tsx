import { Box, Button, Modal, Typography } from "@mui/material"
import { useNavigation } from "../../../hooks/useNavigation"

const InactiveGroupModal = () => {
	const { toCreateGroup, toHome } = useNavigation()
	const open = true
	return (
		<Box>
			<Modal
				open={open}
				onClose={() => {}}
				disableEscapeKeyDown
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: 2
					}}
				>
					<Typography
						id="modal-modal-title"
						variant="subtitle1"
						sx={{ width: 300, mt: 4, mb: 6 }}
					>
						グループ作成するか、開いてください
					</Typography>

					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<Button
							variant="contained"
							type="submit"
							sx={{ height: 48, marginTop: 4 }}
							onClick={() => toCreateGroup()}
						>
							グループを作成する
						</Button>
						<Typography
							id="modal-modal-title"
							variant="subtitle1"
							sx={{
								margin: "20px auto",
								textAlign: "center"
							}}
						>
							or
						</Typography>
						<Button
							sx={{ marginBottom: 4, height: 48 }}
							variant="contained"
							type="submit"
							onClick={() => toHome()}
						>
							既存のグループを開く
						</Button>
					</Box>
				</Box>
			</Modal>
		</Box>
	)
}

export default InactiveGroupModal
