import AddIcon from "@mui/icons-material/Add"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { TabList } from "@mui/lab"
import TabContext from "@mui/lab/TabContext"
import TabPanel from "@mui/lab/TabPanel"
import {
	Box,
	Fab,
	IconButton,
	Modal,
	Skeleton,
	Tab,
	Typography
} from "@mui/material"
import { useEffect, useState } from "react"
import Footer from "../../../components/Footer"
import Header from "../../../components/Header"
import UnderConstruction from "../../../components/UnderConstruction"
import { useLoading } from "../../../provider/LoadingProvider"
import { GroupApi } from "../../group/api/group"
import { TaskApi } from "../api/task"
import useTask from "../hooks/useTask"
import InactiveGroupModal from "./InactiveGroupModal"
import TaskItem from "./TaskItem"
import TaskModal from "./TaskModal"

export type TaskData = {
	id: number
	date: Date
	tasks: Task[]
}

export type Task = {
	id: number
	taskTitle: string
	taskImageUrl: string | null
	taskDetail: string
	period: string
	requestor: {
		participation: {
			user: {
				id: string
				user_name: string
				icon_url: string
			}
		}
	}
}

export type TaskFormInputs = {
	taskTitle: string
	taskDetail: string
	taskImage: File | string | null
	dueDate: string
	dueTime: string
}

const Task = () => {
	const [tabValue, setTabValue] = useState<string>("1")
	const { loading, setLoading } = useLoading()
	const [isActiveGroup, setIsActiveGroup] = useState(true)
	const {
		handleOpenModal,
		tasks,
		open,
		setTasks,
		nextWeekTask,
		prevWeekTask,
		handleCloseModal
	} = useTask()

	useEffect(() => {
		const getTasks = async () => {
			try {
				setLoading(true)
				const response = await GroupApi.getActiveGroup()
				setIsActiveGroup(response.data)
				const taskData = await TaskApi.getTask()
				setTasks(taskData.data)
			} catch (e) {
				console.error("タスクの取得に失敗しました。")
			} finally {
				setLoading(false)
			}
		}
		getTasks()
	}, [])

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setTabValue(newValue)
		event
	}

	const getPrevWeekTasks = async () => {
		prevWeekTask()
	}

	const getNextWeekTasks = async () => {
		nextWeekTask()
	}

	return (
		<>
			<Header />

			<TabContext value={tabValue}>
				<Box
					sx={{
						overflow: "scroll",
						paddingTop: "80px",
						paddingBottom: "120px"
					}}
				>
					<TabList
						onChange={handleChange}
						centered
						sx={{
							"& .MuiTabs-flexContainer": {
								gap: 0
							},
							"& .MuiTabs-indicator": {
								display: "none"
							}
						}}
					>
						<Tab
							label="タスク一覧"
							value="1"
							sx={{
								borderRadius: "8px 8px 0 0",
								borderTop: "0.8px solid #e0e0e0",
								borderLeft: "0.8px solid #e0e0e0",
								borderRight: "0.8px solid #e0e0e0",
								backgroundColor: "white",
								marginBottom: "-0.5px",
								minWidth: "124px",
								transition: "all 0.2s ease",
								position: "relative",
								"&.Mui-selected": {
									borderBottom: "0.5px solid #fafafa",
									transform: "translateY(-3px)",
									zIndex: 1,
									backgroundColor: "white",
									boxShadow: "0 -5px 6px -4px rgba(0, 0, 0, 0.4)"
								},
								"&:not(.Mui-selected)": {
									borderBottom: "0.5px solid #e0e0e0",
									backgroundColor: "white",
									transform: "translateY(0)",
									boxShadow: "inset 0 -2px 3px -2px rgba(0, 0, 0, 0.15)"
								}
							}}
						/>
						<Tab
							label="請負中"
							value="2"
							sx={{
								borderRadius: "8px 8px 0 0",
								borderTop: "0.8px solid #e0e0e0",
								borderLeft: "0.8px solid #e0e0e0",
								borderRight: "0.8px solid #e0e0e0",
								backgroundColor: "white",
								marginBottom: "-0.5px",
								minWidth: "124px",
								transition: "all 0.2s ease",
								position: "relative",
								"&.Mui-selected": {
									borderBottom: "0.5px solid #fafafa",
									transform: "translateY(-3px)",
									zIndex: 1,
									backgroundColor: "white",
									boxShadow: "0 6px -4px rgba(0, 0, 0, 0.2)"
								},
								"&:not(.Mui-selected)": {
									borderBottom: "0.5px solid #e0e0e0",
									backgroundColor: "white",
									transform: "translateY(0)",
									boxShadow: "inset 0 -2px 3px -2px rgba(0, 0, 0, 0.08)"
								}
							}}
						/>
						<Tab
							label="依頼中"
							value="3"
							sx={{
								borderRadius: "8px 8px 0 0",
								borderTop: "0.8px solid #e0e0e0",
								borderLeft: "0.8px solid #e0e0e0",
								borderRight: "0.8px solid #e0e0e0",
								backgroundColor: "white",
								marginBottom: "-0.5px",
								minWidth: "124px",
								transition: "all 0.2s ease",
								position: "relative",
								"&.Mui-selected": {
									borderBottom: "0.5px solid #fafafa",
									transform: "translateY(-3px)",
									zIndex: 1,
									backgroundColor: "white",
									boxShadow: "0 -5px 6px -4px rgba(0, 0, 0, 0.2)"
								},
								"&:not(.Mui-selected)": {
									borderBottom: "0.5px solid #e0e0e0",
									backgroundColor: "white",
									transform: "translateY(0)",
									boxShadow: "inset 0 -2px 3px -2px rgba(0, 0, 0, 0.15)"
								}
							}}
						/>
					</TabList>

					<TabPanel value="1" sx={{ padding: 0 }}>
						{!isActiveGroup ? (
							<InactiveGroupModal />
						) : (
							<TaskItem tasks={tasks} loading={loading} />
						)}
					</TabPanel>

					<TabPanel value="2" sx={{ padding: 0 }}>
						{!isActiveGroup ? (
							<InactiveGroupModal />
						) : (
							<UnderConstruction />
							// <TaskItem tasks={tasks}loading={loading} />
						)}
					</TabPanel>

					<TabPanel value="3" sx={{ padding: 0 }}>
						{!isActiveGroup ? (
							<InactiveGroupModal />
						) : (
							<UnderConstruction />
							// <TaskItem tasks={tasks}loading={loading} />
						)}
					</TabPanel>

					<Fab
						color="primary"
						aria-label="add"
						sx={{
							position: "fixed",
							bottom: 68,
							right: 16,
							boxShadow: "0px 4px 3px rgba(0,0,0,0.15)"
						}}
						onClick={handleOpenModal}
					>
						<AddIcon />
					</Fab>
					<Modal
						open={open}
						onClose={handleCloseModal}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<TaskModal onClose={handleCloseModal} />
					</Modal>

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<IconButton
							aria-label="delete"
							size="large"
							onClick={getPrevWeekTasks}
							sx={{
								backgroundColor: "white",
								borderRadius: "50px",
								padding: "8px",
								transition: "all 0.2s ease-in-out",
								boxShadow: "0px 2px 3px rgba(0,0,0,0.15)"
							}}
						>
							<ArrowBackIosNewIcon fontSize="inherit" />
						</IconButton>

						<Typography
							sx={{
								marginRight: "10px",
								marginLeft: "10px",
								width: "200px",
								textAlign: "center"
							}}
							variant="subtitle1"
						>
							{loading ? (
								<Skeleton
									variant="text"
									width={200}
									height={24}
									sx={{ mx: "auto" }}
								/>
							) : (
								tasks.length > 0 && (
									<>
										{new Date(tasks[0].date).toLocaleDateString("ja-JP", {
											month: "numeric",
											day: "numeric",
											weekday: "short"
										})}
										&nbsp;~&nbsp;
										{new Date(tasks[6].date).toLocaleDateString("ja-JP", {
											month: "numeric",
											day: "numeric",
											weekday: "short"
										})}
									</>
								)
							)}
						</Typography>

						<IconButton
							aria-label="delete"
							size="large"
							onClick={getNextWeekTasks}
							sx={{
								backgroundColor: "white",
								borderRadius: "50px",
								padding: "8px",
								transition: "all 0.2s ease-in-out",
								boxShadow: "0px 2px 3px rgba(0,0,0,0.15)"
							}}
						>
							<ArrowForwardIosIcon fontSize="inherit" />
						</IconButton>
					</Box>
					<Typography
						variant="subtitle1"
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						{tasks.length > 0
							? new Date(tasks[0].date).toLocaleDateString("ja-JP", {
									year: "numeric"
								})
							: ""}
					</Typography>
				</Box>
			</TabContext>

			<Footer />
		</>
	)
}

export default Task
