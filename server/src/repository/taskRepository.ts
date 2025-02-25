import type { Request } from "express"
import { v4 as uuidv4 } from "uuid"
import type { MulterS3File } from "../controller/groupController"
import { prisma } from "../lib/prismaClient"

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
						requestor: {
							participation: {
								groupId: activeGroupId
							}
						}
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						requestor: {
							select: {
								participation: {
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
		// 該当するParticipationのIDを取得
		const participation = await prisma.participation.findFirst({
			where: {
				AND: [{ userId: req.user.uid }, { groupId: activeGroupId }]
			},
			select: {
				id: true
			}
		})

		if (!participation) {
			throw new Error("該当するデータが見つかりませんでした。")
		}

		// 取得したParticipation IDを使ってRequestorsを作成
		const requestor = await prisma.requestors.create({
			data: {
				id: uuidv4(),
				participation_id: participation.id
			}
		})

		return prisma.task.create({
			data: {
				taskTitle,
				taskDetail,
				...(req.file && { taskImageUrl: (req.file as MulterS3File)?.location }),
				period,
				requestor_id: requestor.id,
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
						requestor: {
							participation: {
								groupId: activeGroupId
							}
						}
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						requestor: {
							select: {
								participation: {
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
						requestor: {
							participation: {
								groupId: activeGroupId
							}
						}
					},
					select: {
						id: true,
						taskTitle: true,
						taskImageUrl: true,
						taskDetail: true,
						period: true,
						requestor: {
							select: {
								participation: {
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
					}
				}
			},
			orderBy: {
				date: "asc"
			}
		})
	}
}
