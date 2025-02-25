import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Badge,
	Box,
	Typography
} from "@mui/material"
import EachTask from "./EachTask"
import type { TaskData } from "./Task"
import TaskLitSkeleton from "./TaskLitSkeleton"

export type TaskItemProps = {
	tasks: TaskData[]
	loading?: boolean
}

const TaskItem = ({ tasks, loading }: TaskItemProps) => {
	if (loading) {
		return (
			<>
				{Array(7)
					.fill(0)
					.map((_, index) => (
						<TaskLitSkeleton key={index} />
					))}
			</>
		)
	}

	return (
		<>
			{tasks.map((task) => (
				<Accordion
					key={task.id}
					sx={{ minHeight: 84, border: "none", boxShadow: "none" }}
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1-content"
						id="panel1-header"
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								width: "100%"
							}}
						>
							<Typography variant="h6">
								{" "}
								{new Date(task.date).toLocaleDateString("ja-JP", {
									month: "numeric",
									day: "numeric",
									weekday: "short"
								})}
							</Typography>
							<Badge
								badgeContent={task.tasks.length}
								sx={{
									marginRight: 4,
									"& .MuiBadge-badge": {
										backgroundColor: "#4CAF50",
										color: "white",
										minWidth: "22px",
										height: "22px",
										fontSize: "0.85rem",
										padding: "0 6px"
									}
								}}
							></Badge>
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						{/* TODOあとでpropsの命名を修正する */}
						<EachTask taskItems={task.tasks} />
					</AccordionDetails>
				</Accordion>
			))}
		</>
	)
}

export default TaskItem
