import {
	Avatar,
	Box,
	Button,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	TextField,
	Typography
} from "@mui/material"
import { useState } from "react"
import { Task } from "./Task"
type TaskItems = {
	taskItems: Task[]
}

const EachTask: React.FC<TaskItems> = ({ taskItems }) => {
	const [open, setOpen] = useState(false)
	const [selectedTask, setSelectedTask] = useState<Task | null>(null)

	const handleOpen = (task: Task) => {
		setSelectedTask(task)
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setSelectedTask(null)
	}
	console.log("各くタスク展開する")

	return (
		<>
			{taskItems.map((task) => {
				return (
					<Box key={task.id}>
						<Paper
							elevation={0}
							onClick={() => handleOpen(task)}
							variant="outlined"
							sx={{
								display: "flex",
								alignItems: "center",
								padding: 3,
								borderRadius: "4px",
								border: "1px solid #E0E0E0"
							}}
						>
							<Avatar src={task.createdUser.user.icon_url} />
							<Typography
								sx={{
									flex: 1,
									textAlign: "center"
								}}
								variant="h6"
							>
								{task.taskTitle}
							</Typography>
							<Box sx={{ width: 40 }} />
						</Paper>

						{selectedTask && (
							<Dialog
								open={open}
								onClose={handleClose}
								PaperProps={{
									sx: {
										width: "100vw",
										borderRadius: "8px"
									}
								}}
							>
								<Box
									sx={{
										display: "flex",
										alignItems: "center"
									}}
								>
									<Avatar
										src={task.createdUser.user.icon_url}
										sx={{ marginLeft: 2 }}
									/>
									<DialogTitle
										sx={{
											flex: 1,
											textAlign: "center"
										}}
									>
										{selectedTask.taskTitle}
									</DialogTitle>
									<Box sx={{ width: 40 }} />
								</Box>
								<DialogContent
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										width: "100%",
										maxWidth: "800px",
										margin: "0 auto"
									}}
								>
									<TextField
										defaultValue={selectedTask.taskDetail}
										id="outlined-multiline-static"
										label="タスク詳細"
										multiline
										rows={8}
										sx={{
											marginBottom: 2,
											width: "100%",
											maxWidth: "500px"
										}}
									/>

									{selectedTask.taskImageUrl && (
										<CardMedia
											component="img"
											height="194"
											image={selectedTask.taskImageUrl}
											sx={{
												width: "100%",
												maxWidth: "500px",
												objectFit: "contain"
											}}
										/>
									)}
									<Typography sx={{ marginTop: 4 }}>
										期限：
										{new Date(selectedTask.period).toLocaleString("ja-JP", {
											year: "numeric",
											month: "numeric",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit"
										})}
									</Typography>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleClose}>閉じる</Button>
								</DialogActions>
							</Dialog>
						)}
					</Box>
				)
			})}
		</>
	)
}

export default EachTask
