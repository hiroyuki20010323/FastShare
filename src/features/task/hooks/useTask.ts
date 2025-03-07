import { AxiosError } from "axios"
import { useState } from "react"
import { useAlert } from "../../../provider/AlertProvider"
import { useLoading } from "../../../provider/LoadingProvider"
import { useTaskContext } from "../../../provider/TaskProvider"
import { TaskApi } from "../api/task"
import type { TaskFormInputs } from "../components/Task"

export const useTask = () => {
	const { tasks, setTasks } = useTaskContext()
	const [open, setOpen] = useState<boolean>(false)
	const { showAlert } = useAlert()
	const { setLoading } = useLoading()

	const createTask = async (
		{ taskTitle, taskDetail, taskImage, dueDate, dueTime }: TaskFormInputs,
		onClose: () => void
	) => {
		try {
			setLoading(true)
			const createResponse = await TaskApi.createTask({
				taskTitle,
				taskDetail,
				taskImage,
				dueDate,
				dueTime
			})
			const response = await TaskApi.getTask()
			setTasks(response.data)
			showAlert(createResponse.data.message, "success")
			setLoading(false)
			onClose()
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert(error.response?.data?.error, "error")
			} else {
				showAlert("予期せぬエラーが発生しました", "error")
			}
		}
	}

	const handleOpenModal = () => {
		setOpen(true)
	}
	const handleCloseModal = () => {
		setOpen(false)
	}

	const prevWeekTask = async () => {
		setLoading(true)
		const currentDate = tasks[0].date
		const response = await TaskApi.prevWeekTaskData(currentDate)
		setLoading(false)
		setTasks(response.data)
	}

	const nextWeekTask = async () => {
		setLoading(true)
		const currentDate = tasks[6].date
		const response = await TaskApi.nextWeekTaskData(currentDate)
		setLoading(false)
		setTasks(response.data)
	}

	return {
		createTask,
		handleCloseModal,
		handleOpenModal,
		tasks,
		open,
		setTasks,
		nextWeekTask,
		prevWeekTask
	}
}

export default useTask
