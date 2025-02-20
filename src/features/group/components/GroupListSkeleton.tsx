import { List, ListItem, Skeleton } from "@mui/material"

const GroupListSkeleton = () => {
	return (
		<List
			sx={{
				margin: 0,
				display: "flex",
				border: "solid 1px  #E0E0E0",
				padding: "14px",
				borderTop: "none",
				alignItems: "center"
			}}
		>
			<Skeleton
				variant="circular"
				width={40}
				height={40}
				sx={{
					marginTop: "3px",
					marginRight: "10px",
					marginLeft: "10px",
					minWidth: "40px",
					minHeight: "40px"
				}}
			/>
			<ListItem
				sx={{
					display: "flex",
					flexFlow: "column",
					alignItems: "flex-start"
				}}
			>
				<Skeleton variant="text" width={150} height={24} />
				<Skeleton variant="text" width={80} height={20} />
			</ListItem>
			<Skeleton
				variant="rectangular"
				width={98}
				height={30}
				sx={{
					borderRadius: 1,
					marginLeft: "auto"
				}}
			/>
		</List>
	)
}

export default GroupListSkeleton
