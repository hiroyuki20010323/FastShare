import { api } from "../../../lib/axios"
import { TaskFormInputs } from "../components/Task"

export const TaskApi = {
	createTask: async ({
		taskTitle,
		taskDetail,
		taskImage,
		dueDate,
		dueTime
	}: TaskFormInputs) => {
		const formData = new FormData()

		if (taskImage) {
			formData.append("taskImage", taskImage)
		}
		formData.append("taskTitle", taskTitle)
		formData.append("taskDetail", taskDetail)
		formData.append("dueDate", dueDate)
		formData.append("dueTime", dueTime)

		await api.post(`/api/task`, formData)
	},

	getTask: async () => {
		return await api.get(`/api/task`)
	},

	prevWeekTaskData: async (currentDate: Date) => {
		return api.get(`/api/task/prev-week`, {
			params: { date: currentDate }
		})
	},

	nextWeekTaskData: async (currentDate: Date) => {
		return api.get(`/api/task/next-week`, {
			params: { date: currentDate }
		})
	}
}
