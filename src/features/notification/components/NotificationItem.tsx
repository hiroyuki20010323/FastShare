import { Avatar, List, ListItem, Typography } from "@mui/material"

const NotificationItem = () => {
	return (
		<List
			sx={{
				display: "flex",
				border: "solid 2px  #E0E0E0",
				padding: "20px",
				borderTop: "none",
				overflow: "scroll"
			}}
		>
			<Avatar sx={{ marginTop: "10px", marginRight: "10px", sizes: "lg" }} />
			<ListItem
				sx={{ display: "flex", flexFlow: "column", alignItems: "flex-start" }}
			>
				<Typography variant="subtitle1">user123</Typography>
				<Typography variant="caption">
					user123がuser1のタスクを完了しました!
				</Typography>
			</ListItem>
			<Typography variant="caption">12:00</Typography>
		</List>
	)
}

export default NotificationItem
