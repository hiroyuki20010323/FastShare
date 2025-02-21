import { Request } from "express"
import { prisma } from "../lib/prismaClient"
import { MulterS3File } from "../controller/groupController"

export type GetTaskData = {
	todayJST: Date
	oneWeekLaterJST: Date
	activeGroupId: number
}

export type CalenDar = {
	id: number
	createdAt: Date
	updatedAt: Date
	date: Date
}

export type CreateTaskDataType = {
	taskTitle: string
	taskDetail?: string
	period: Date
	activeGroupId: number
	calendar: CalenDar
}

export type WeekRangeData = {
	startDate: Date
	endDate: Date
	activeGroupId: number
}

export const TaskRepo = {
	// アクティブなグループを取得
	getActiveParticipation: async (req: Request) => {
		return await prisma.participation.findFirst({
			where: {
				userId: req.user.uid,
				isActive: true
			}
		})
	},
	// タスクデータの取得
	getTaskData: async ({
		todayJST,
		oneWeekLaterJST,
		activeGroupId
	}: GetTaskData) => {
		return await prisma.calendar.findMany({
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
	},
	// カレンダーの日付と期限を比較して、一致するカレンダーのidを取得
	findDueDate: async (calenderDate: Date) => {
		return await prisma.calendar.findUnique({
			where: { date: calenderDate }
		})
	},
	// タスクの作成
	createTaskData: async (
		req: Request,
		{
			taskTitle,
			taskDetail,
			period,
			activeGroupId,
			calendar
		}: CreateTaskDataType
	) => {
		return prisma.task.create({
			data: {
				taskTitle,
				taskDetail,
				...(req.file && { taskImageUrl: (req.file as MulterS3File)?.location }),
				period,
				participationCreatedUserId: req.user.uid,
				participationCreatedGroupId: activeGroupId,
				calendarId: calendar!.id
			}
		})
	},
	// 先週のタスクデータを取得
	getPrevWeekTask: async ({
		startDate,
		endDate,
		activeGroupId
	}: WeekRangeData) => {
		return await prisma.calendar.findMany({
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
	},
	// 来週のタスクデータを取得
	getNextWeekTaskData: async ({
		startDate,
		endDate,
		activeGroupId
	}: WeekRangeData) => {
		return await prisma.calendar.findMany({
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
	}
}
