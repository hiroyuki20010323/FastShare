import { Box, Typography } from "@mui/material"

const UnderConstruction = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: 4,
				gap: 2,
				mt: 20
			}}
		>
			<span role="img" aria-label="construction" style={{ fontSize: "3em" }}>
				🚧 🏗️
			</span>
			<Typography variant="h5" color="text.secondary">
				一生懸命実装中・・・
				<br />
				しばらくお待ちください
			</Typography>
			<span role="img" aria-label="construction" style={{ fontSize: "3em" }}>
				👷 👷‍♀️
			</span>
			<Box sx={{ mb: 10 }}></Box>
		</Box>
	)
}

export default UnderConstruction
