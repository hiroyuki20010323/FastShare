import type React from "react"
import { type ReactNode, createContext, useContext, useState } from "react"
import type { TaskData } from "../features/task/components/Task"

type TaskContextType = {
	tasks: TaskData[]
	setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const TaskProvider = ({ children }: { children: ReactNode }) => {
	const [tasks, setTasks] = useState<TaskData[]>([])
	return (
		<TaskContext.Provider value={{ tasks, setTasks }}>
			{children}
		</TaskContext.Provider>
	)
}

export const useTaskContext = () => {
	const context = useContext(TaskContext)
	if (!context) {
		throw new Error("使い方が間違っています")
	}
	return context
}
