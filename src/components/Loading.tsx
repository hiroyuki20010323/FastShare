import { Box, CircularProgress } from "@mui/material"

const Loading = () => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh"
			}}
		>
			<CircularProgress size={50} />
		</Box>
	)
}

export default Loading
