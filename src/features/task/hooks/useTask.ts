import { useState } from "react"
import { TaskData, TaskFormInputs } from "../components/Task"

import { TaskApi } from "../api/task"

export const useTask = () => {
	const [tasks, setTasks] = useState<TaskData[]>([])
	const [open, setOpen] = useState<boolean>(false)

	const createTask = async (
		{ taskTitle, taskDetail, taskImage, dueDate, dueTime }: TaskFormInputs,
		onClose: () => void
	) => {
		try {
			await TaskApi.createTask({
				taskTitle,
				taskDetail,
				taskImage,
				dueDate,
				dueTime
			})
			onClose()
			const response = await TaskApi.getTask()
			setTasks(response.data)
		} catch (e) {
			console.log("なんかのエラーが出ました", e)
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
