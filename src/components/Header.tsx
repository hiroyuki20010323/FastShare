import { AppBar, Avatar, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { GroupApi } from "../features/group/api/group"
import { useGroupIcon } from "../hooks/useSWR"

const Header = () => {
	const [pathName, setPathName] = useState(location.pathname)
	const { groupIcon } = useGroupIcon()
	const [checkActiveGroup, setCheckActiveGroup] = useState(false)
	useEffect(() => {
		setPathName(location.pathname)
		// アクティブなグループデータを取得して、falseの時はアイコンを表示しない
		;(async () => {
			const response = await GroupApi.getActiveGroup()
			setCheckActiveGroup(response.data.group_name)
		})()
	}, [])
	return (
		<>
			{/* TODO:原始的な方法でアイコンの位置などを調整しているので後で修正する */}
			<AppBar
				elevation={0}
				sx={{
					width: "100vw",
					top: 0,
					height: "74px",
					backgroundColor: "white",
					pb: 0.6,
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
					position: "fixed"
				}}
			>
				<Toolbar
					sx={{
						marginTop: 2,
						display: "flex",
						alignItems: "center",
						position: "relative"
					}}
				>
					<Typography
						variant="h6"
						component="div"
						color="black"
						sx={{
							position: "absolute",
							left: "50%",
							transform: "translateX(-50%)"
						}}
					>
						{pathName === "/"
							? "グループ一覧"
							: pathName === "/creategroup"
								? "グループ作成"
								: pathName === "/task"
									? "タスク一覧"
									: pathName === "/notification"
										? "通知"
										: pathName === "/profile"
											? "プロフィール"
											: pathName === "/groupsettings"
												? "グループ"
												: pathName === "/invitation"
													? "招待リンク"
													: ""}
					</Typography>
					{checkActiveGroup ? (
						<Avatar
							src={groupIcon || undefined}
							component={Link}
							to="/groupsettings"
							sx={{
								position: "absolute",
								right: "28px",
								boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.2)",
								border: "1px solid rgba(0, 0, 0, 0.1)"
							}}
						/>
					) : null}
				</Toolbar>
			</AppBar>
		</>
	)
}

export default Header
