import { Request, Response } from "express"
import { prisma } from "../lib/prismaClient"
import { startOfDay, addDays } from "date-fns"
import { toZonedTime } from "date-fns-tz"

// タスクの取得
export const getTask = async (req: Request, res: Response) => {
	try {
		const activeParticipation = await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			}
		})

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

		const tasks = await prisma.calendar.findMany({
			where: {
				date: {
					gte: todayJST,
					lte: oneWeekLaterJST
				}
			},
			select: {
				id: true,
				date: true,
				tasks: {
					where: {
						participationCreatedGroupId: activeGroupId
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						createdUser: {
							select: {
								user: {
									select: {
										id: true,
										user_name: true,
										icon_url: true
									}
								}
							}
						}
					}
				}
			},
			orderBy: {
				date: "asc"
			}
		})

		res.status(200).json(tasks)
	} catch (e) {
		console.log("タスクデータの取得失敗しました。", e)
	}
}

// タスク追加
export const createTask = async (req: Request, res: Response) => {
	try {
		const activeParticipation = await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			}
		})

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
			const calender = await prisma.calendar.findUnique({
				where: { date: calenderDate }
			})

			const task = await prisma.task.create({
				data: {
					taskTitle,
					taskDetail,
					...(req.file && { taskImageUrl: (req.file as any)?.location }),
					period,
					participationCreatedUserId: req.user.uid,
					participationCreatedGroupId: activeGroupId,
					calendarId: calender!.id
				}
			})

			res.status(201).json({ message: "タスクが作成されました", task })
		} catch (e) {
			res.status(500).json({ message: "指定された日にタスクは追加できません" })
		}
	} catch (e) {
		console.log("タスクの投稿に失敗しました。", e)
	}
}

// 先週のタスク
export const getPrevWeekTask = async (req: Request, res: Response) => {
	try {
		const activeParticipation = await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			}
		})

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

		const tasks = await prisma.calendar.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate
				}
			},
			select: {
				id: true,
				date: true,
				tasks: {
					where: {
						participationCreatedGroupId: activeGroupId
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						createdUser: {
							select: {
								user: {
									select: {
										id: true,
										user_name: true,
										icon_url: true
									}
								}
							}
						}
					}
				}
			},
			orderBy: {
				date: "asc"
			}
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
		const activeParticipation = await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			}
		})

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

		const tasks = await prisma.calendar.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate
				}
			},
			select: {
				id: true,
				date: true,
				tasks: {
					where: {
						participationCreatedGroupId: activeGroupId
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						createdUser: {
							select: {
								user: {
									select: {
										id: true,
										user_name: true,
										icon_url: true
									}
								}
							}
						}
					}
				}
			},
			orderBy: {
				date: "asc"
			}
		})

		res.status(200).json(tasks)
	} catch (e) {
		res.status(500).json({ error: "データの取得に失敗しました" })
	}
}
