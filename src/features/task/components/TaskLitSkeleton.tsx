import { Accordion, AccordionSummary, Box, Skeleton } from "@mui/material"

const TaskLitSkeleton = () => {
	return (
		<Accordion sx={{ minHeight: 84, border: "none", boxShadow: "none" }}>
			<AccordionSummary>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%"
					}}
				>
					<Skeleton variant="text" width={100} height={40} />
					<Skeleton
						variant="circular"
						width={20}
						height={20}
						sx={{ marginRight: 4 }}
					/>
				</Box>
			</AccordionSummary>
		</Accordion>
	)
}

export default TaskLitSkeleton
