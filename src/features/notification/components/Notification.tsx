import { Box } from "@mui/material"
import Header from "../../../components/Header"
// import NotificationItem from "./NotificationItem"
import Footer from "../../../components/Footer"
import UnderConstruction from "../../../components/UnderConstruction"

const Notification = () => {
	return (
		<Box>
			<Header />
			<UnderConstruction />
			{/* <Box sx={{ paddingTop: "80px", paddingBottom: "80px" }}>
				<NotificationItem />
				<NotificationItem />
				<NotificationItem />
				<NotificationItem />
				<NotificationItem />
				<NotificationItem />
				<NotificationItem />
				<NotificationItem />
				<NotificationItem />
			</Box> */}
			<Footer />
		</Box>
	)
}

export default Notification
