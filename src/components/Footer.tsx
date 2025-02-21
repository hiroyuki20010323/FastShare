import {
	Avatar,
	BottomNavigation,
	BottomNavigationAction,
	Paper
} from "@mui/material"

import GroupsIcon from "@mui/icons-material/Groups"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import NotificationsIcon from "@mui/icons-material/Notifications"
import ListAltIcon from "@mui/icons-material/ListAlt"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useUserIcon } from "../hooks/useSWR"

const Footer = () => {
	const [value, setValue] = useState(location.pathname)
	const { userIcon } = useUserIcon()
	const handleChange = (event: React.BaseSyntheticEvent, newValue: string) => {
		event
		setValue(newValue)
	}
	useEffect(() => {
		setValue(location.pathname)
	}, [location.pathname])
	return (
		<>
			<Paper
				sx={{
					width: "100vw",
					position: "fixed",
					bottom: 0,
					left: 0,
					right: 0,
					paddingBottom: 6,
					pt: 0.6,
					marginTop: 2,
					height: "58px",
					zIndex: 99,
					borderTop: '0.8px solid rgba(0, 0, 0, 0.1)'
				}}
				elevation={0}
			>
				<BottomNavigation
					value={value}
					onChange={handleChange}
					sx={{
						"& .MuiBottomNavigationAction-root": {
							minWidth: "54px",
							padding: "30px 0",
							"&.Mui-selected": {
								transform: "translateY(-3px)",
								transition: "transform 0.2s ease-in-out"
							}
						},
						px: 1
					}}
				>
					<BottomNavigationAction
						label="グループ"
						value="/"
						icon={<GroupsIcon />}
						component={Link}
						to="/"
					/>
					<BottomNavigationAction
						label="作成"
						value="/creategroup"
						icon={<AddCircleOutlineIcon />}
						component={Link}
						to="/creategroup"
					/>
					<BottomNavigationAction
						label="タスク"
						value="/task"
						icon={<ListAltIcon />}
						component={Link}
						to="/task"
					/>
					<BottomNavigationAction
						label="通知"
						value="/notification"
						icon={<NotificationsIcon />}
						component={Link}
						to="/notification"
					/>
					<BottomNavigationAction
						label="ユーザー"
						value="/profile"
						icon={
							<Avatar
								src={userIcon || undefined}
								sx={{
									width: "28px",
									height: "28px",
									border: "1px solid rgba(0, 0, 0, 0.12)"
								}}
							/>
						}
						component={Link}
						to="/profile"
					/>
				</BottomNavigation>
			</Paper>
		</>
	)
}

export default Footer
