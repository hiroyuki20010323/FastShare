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
import { TaskData } from "./Task"

export type TaskItemProps = {
	tasks: TaskData[]
}

const TaskItem = ({ tasks }: TaskItemProps) => {
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
								color="success"
								sx={{ marginRight: 4 }}
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
