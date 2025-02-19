import { Box, Fab, IconButton, Modal, Tab, Typography } from "@mui/material"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import TabPanel from "@mui/lab/TabPanel"
import { useEffect, useState } from "react"
import TabContext from "@mui/lab/TabContext"
import { TabList } from "@mui/lab"
import AddIcon from "@mui/icons-material/Add"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import TaskItem from "./TaskItem"
import Loading from "../../../components/Loading"
import useTask from "../hooks/useTask"
import TaskModal from "./TaskModal"
import { useLoading } from "../../../provider/LoadingProvider"
import { TaskApi } from "../api/task"
import { GroupApi } from "../../group/api/group"
import InactiveGroupModal from "./InactiveGroupModal"

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
	createdUser: {
		user: {
			id: string
			user_name: string
			icon_url: string
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
					<TabList onChange={handleChange} centered>
						<Tab label="全体タスク" value="1" />
						{/* <Tab label="請負中のタスク" value="2" />
						<Tab label="依頼したタスク" value="3" /> */}
					</TabList>

					<TabPanel value="1" sx={{ padding: 0 }}>
						{loading ? (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "28vh",
									flexFlow: "column",
									marginBottom: 40
								}}
							>
								<Loading />
							</Box>
						) : !isActiveGroup ? (
							<InactiveGroupModal />
						) : (
							<TaskItem tasks={tasks} />
						)}
					</TabPanel>

					{/* <TabPanel value="2" sx={{ padding: 0 }}>
						<WeekTask />
					</TabPanel>

					<TabPanel value="3" sx={{ padding: 0 }}>
						<WeekTask />
					</TabPanel> */}

					<Fab
						color="primary"
						aria-label="add"
						sx={{
							position: "fixed",
							bottom: 80,
							right: 16
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
							{tasks.length > 0 ? (
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
							) : (
								"データ読み込み中..."
							)}
						</Typography>

						<IconButton
							aria-label="delete"
							size="large"
							onClick={getNextWeekTasks}
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
