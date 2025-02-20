import { Request, Response } from "express"
import { startOfDay, addDays } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { TaskRepo } from "../repository/taskRepository"

// タスクの取得
export const getTask = async (req: Request, res: Response) => {
	try {
		const activeParticipation = await TaskRepo.getActiveParticipation(req)

		if (!activeParticipation) {
			res
				.status(404)
				.json({ message: "アクティブなグループが見つかりません。" })
			return
		}

		const activeGroupId = activeParticipation.groupId

		const timeZone = "Asia/Tokyo"
		const todayJST = startOfDay(toZonedTime(new Date(), timeZone))

		const oneWeekLaterJST = addDays(todayJST, 6)

		const tasks = await TaskRepo.getTaskData({
			activeGroupId,
			oneWeekLaterJST,
			todayJST
		})

		res.status(200).json(tasks)
	} catch (e) {
		console.log("タスクデータの取得失敗しました。", e)
	}
}

// タスク追加
export const createTask = async (req: Request, res: Response) => {
	try {
		const activeParticipation = await TaskRepo.getActiveParticipation(req)

		if (!activeParticipation) {
			res
				.status(404)
				.json({ message: "アクティブなグループが見つかりません。" })
			return
		}

		const activeGroupId = activeParticipation.groupId

		const { taskTitle, taskDetail, dueDate, dueTime } = req.body

		const period = new Date(`${dueDate}T${dueTime || "00:00"}:00`)

		const calenderDate = new Date(`${dueDate}T00:00:00`)
		try {
			const calendar = await TaskRepo.findDueDate(calenderDate)

			if (!calendar) {
				res.status(500).json({ error: "指定されたカレンダーが見つかりません" })
				return
			}

			const task = await TaskRepo.createTaskData(req, {
				taskTitle,
				taskDetail,
				period,
				activeGroupId,
				calendar
			})

			res.status(201).json({ message: "タスクが作成されました!", task })
			return
		} catch (e) {
			res.status(500).json({ error: "指定された日にタスクは追加できません" })
		}
	} catch (e) {
		console.log("タスクの投稿に失敗しました。", e)
	}
}

// 先週のタスク
export const getPrevWeekTask = async (req: Request, res: Response) => {
	try {
		const activeParticipation = await TaskRepo.getActiveParticipation(req)

		if (!activeParticipation) {
			res
				.status(404)
				.json({ message: "アクティブなグループが見つかりません。" })
			return
		}

		const activeGroupId = activeParticipation.groupId
		const timeZone = "Asia/Tokyo"
		const currentDate = req.query.date
			? new Date(String(req.query.date))
			: new Date()
		const endDate = startOfDay(toZonedTime(addDays(currentDate, -1), timeZone))
		const startDate = addDays(endDate, -6)

		const tasks = await TaskRepo.getPrevWeekTask({
			activeGroupId,
			startDate,
			endDate
		})
		res.status(200).json(tasks)
	} catch (e) {
		console.log("前週のタスクデータの取得に失敗しました。", e)
		res.status(500).json({ error: "データの取得に失敗しました" })
	}
}

// 来週のタスク取得
export const getNextWeekTask = async (req: Request, res: Response) => {
	try {
		const activeParticipation = await TaskRepo.getActiveParticipation(req)

		if (!activeParticipation) {
			res
				.status(404)
				.json({ message: "アクティブなグループが見つかりません。" })
			return
		}

		const activeGroupId = activeParticipation.groupId
		const timeZone = "Asia/Tokyo"
		const currentDate = req.query.date
			? new Date(String(req.query.date))
			: new Date()
		const startDate = startOfDay(toZonedTime(addDays(currentDate, 1), timeZone))
		const endDate = addDays(startDate, 6)

		const tasks = await TaskRepo.getNextWeekTaskData({
			activeGroupId,
			startDate,
			endDate
		})
		res.status(200).json(tasks)
	} catch (e) {
		res.status(500).json({ error: "データの取得に失敗しました" })
	}
}
