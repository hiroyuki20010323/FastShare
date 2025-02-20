import { Box, Button, Modal, Typography } from "@mui/material"
import useGroup from "../hooks/useGroup"
import { Group } from "./Home"

type DeleteConfirmModalProps = {
	groupData: Group
	setDeleteModalOpen: (open: boolean) => void
	deleteModalOpen: boolean
}

const DeleteConfirmModal = ({
	groupData,
	setDeleteModalOpen,
	deleteModalOpen
}: DeleteConfirmModalProps) => {
	const { groupDelete } = useGroup()
	const handleDeleteConfirm = () => {
		onDelete(groupData.id)
		setDeleteModalOpen(false)
	}
	const onDelete = async (groupId: number) => groupDelete(groupId)
	return (
		<>
			<Modal
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				aria-labelledby="delete-modal-title"
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
						borderRadius: 2,
						width: 350,
						height: 300
					}}
				>
					<Typography
						id="delete-modal-title"
						variant="subtitle1"
						component="h2"
						sx={{
							mb: 2,
							fontSize: "1.2rem",
							fontWeight: "bold",
							textAlign: "center",
							pb: 2,
							borderBottom: "1px solid #e0e0e0"
						}}
					>
						グループ削除
					</Typography>
					<Typography
						id="delete-modal-title"
						variant="subtitle1"
						component="h2"
						sx={{ mb: 2 }}
					>
						削除すると、タスクデータなど全て削除されます
						<br />
						<br />
						本当によろしいですか？
					</Typography>
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-end",
							gap: 4,
							position: "absolute",
							bottom: 20,
							right: 40
						}}
					>
						<Button
							variant="outlined"
							onClick={() => setDeleteModalOpen(false)}
							sx={{ minWidth: "120px" }}
						>
							いいえ
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={handleDeleteConfirm}
							sx={{ minWidth: "88px" }}
						>
							はい
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	)
}

export default DeleteConfirmModal
