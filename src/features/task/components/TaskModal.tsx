import {
	Box,
	Button,
	CardMedia,
	FormControl,
	TextField,
	Typography
} from "@mui/material"
import { forwardRef, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import ModalLoading from "../../../components/ModalLoading"
import { useLoading } from "../../../provider/LoadingProvider"
import useTask from "../hooks/useTask"
import type { TaskFormInputs } from "./Task"
type TaskModalProps = {
	onClose: () => void
}

const TaskModal = forwardRef<HTMLDivElement, TaskModalProps>(
	({ onClose }, ref) => {
		const { createTask } = useTask()
		const fileInputRef = useRef<HTMLInputElement | null>(null)
		const [image, setImage] = useState<string | undefined>(undefined)
		const { loading } = useLoading()
		const { control, handleSubmit, setValue } = useForm<TaskFormInputs>({
			mode: "onSubmit",
			defaultValues: {
				taskTitle: "",
				taskDetail: "",
				taskImage: "",
				dueDate: "",
				dueTime: ""
			}
		})
		const style = {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			width: 400,
			bgcolor: "background.paper",
			border: "2px solid #000",
			boxShadow: 24,
			p: 4
		}

		const handleInput = () => {
			const files = fileInputRef.current?.files
			if (!files) return
			const file = files[0]
			setValue("taskImage", file)
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = (e) => {
				setImage(String(e.target?.result))
			}
		}

		const fileUpload = () => {
			fileInputRef.current?.click()
		}

		const onSubmit = async ({
			taskTitle,
			taskDetail,
			taskImage,
			dueDate,
			dueTime
		}: TaskFormInputs) => {
			createTask(
				{
					taskTitle,
					taskDetail,
					taskImage,
					dueDate,
					dueTime
				},
				onClose
			)
		}
		if (loading) {
			return <ModalLoading />
		}

		return (
			<Box sx={style} ref={ref} tabIndex={-1}>
				<Box
					sx={{
						alignItems: "center",
						display: "flex",
						flexDirection: "column",
						width: "100%",
						height: "calc(100vh - 100px)",
						overflowY: "auto",
						overflowX: "hidden"
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							marginBottom: 4,
							position: "relative",
							width: "100%"
						}}
					>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
							sx={{
								width: "100%",
								textAlign: "center"
							}}
						>
							タスク追加
						</Typography>
						<Button
							onClick={onClose}
							color="error"
							sx={{
								position: "absolute",
								right: 0
							}}
						>
							閉じる
						</Button>
					</Box>

					<FormControl
						component="form"
						variant="standard"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="taskTitle"
							control={control}
							rules={{
								required: {
									value: true,
									message: "タイトルの入力は流石に必須です"
								}
							}}
							render={({ field, formState: { errors } }) => (
								<TextField
									{...field}
									id="outline-disabled"
									label="タスク名"
									style={{ width: 280, marginBottom: 50 }}
									error={errors.taskTitle ? true : false}
									helperText={errors.taskTitle?.message}
								/>
							)}
						/>
						<Controller
							name="taskDetail"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									id="outlined-multiline-static"
									name="taskDetail"
									label="タスク詳細"
									multiline
									rows={8}
								/>
							)}
						/>

						<Box sx={{ display: "flex", alignItems: "center" }}>
							{image ? (
								<CardMedia
									onClick={fileUpload}
									component="img"
									height="300"
									image={image}
									sx={{ width: 280, objectFit: "contain" }}
								/>
							) : (
								<Button
									onClick={fileUpload}
									variant="outlined"
									sx={{ width: 280, height: 194 }}
								>
									画像を選択
								</Button>
							)}
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleInput}
								style={{ display: "none" }}
								accept="image/*"
							/>
						</Box>

						<Controller
							name="dueDate"
							rules={{
								required: {
									value: true,
									message: "期限日は必ず指定しましょう"
								}
							}}
							control={control}
							render={({ field, formState: { errors } }) => (
								<TextField
									{...field}
									type="date"
									label="期限日"
									sx={{
										mt: 4,
										mb: 4,
										"& .MuiInputLabel-root": {
											transform: "translate(14px, -14px) scale(0.80)"
										}
									}}
									error={errors.dueDate ? true : false}
									helperText={errors.dueDate?.message}
								/>
							)}
						/>
						<Controller
							name="dueTime"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									type="time"
									label="時間"
									sx={{
										"& .MuiInputLabel-root": {
											transform: "translate(14px, -14px) scale(0.80)"
										}
									}}
								/>
							)}
						/>

						<Button
							variant="contained"
							sx={{ height: 40, marginTop: 8, marginBottom: 4 }}
							onClick={handleSubmit(onSubmit)}
						>
							追加
						</Button>
					</FormControl>
				</Box>
			</Box>
		)
	}
)

export default TaskModal
