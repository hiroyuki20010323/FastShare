import { Box, CircularProgress, Modal } from "@mui/material"

const ModalLoading = () => {
	return (
		<Modal
			open={true}
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<Box
				sx={{
					bgcolor: "background.paper",
					borderRadius: 2,
					p: 4,
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<CircularProgress size={38} />
			</Box>
		</Modal>
	)
}

export default ModalLoading
