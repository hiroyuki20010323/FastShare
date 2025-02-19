import { useState } from "react"
import { TaskData, TaskFormInputs } from "../components/Task"

import { TaskApi } from "../api/task"
import { useAlert } from "../../../provider/AlertProvider"
import { AxiosError } from "axios"

export const useTask = () => {
	const [tasks, setTasks] = useState<TaskData[]>([])
	const [open, setOpen] = useState<boolean>(false)
	const { showAlert } = useAlert()

	const createTask = async (
		{ taskTitle, taskDetail, taskImage, dueDate, dueTime }: TaskFormInputs,
		onClose: () => void
	) => {
		try {
		const createResponse = 	await TaskApi.createTask({
				taskTitle,
				taskDetail,
				taskImage,
				dueDate,
				dueTime
			})
			console.log(1)
			const { data: newTasks } = await TaskApi.getTask()
			setTasks(newTasks)	
			showAlert(createResponse.data.message,'success')
			onClose()
		} catch (error) {
			if (error instanceof AxiosError) {
        showAlert(error.response?.data?.error, 'error')
      } else {
        showAlert('予期せぬエラーが発生しました', 'error')
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
		const currentDate = tasks[0].date
		const response = await TaskApi.prevWeekTaskData(currentDate)
		setTasks(response.data)
	}

	const nextWeekTask = async () => {
		const currentDate = tasks[6].date
		const response = await TaskApi.nextWeekTaskData(currentDate)
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
