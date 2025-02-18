import { useAuthContext } from "../../../provider/AuthProvider"
import { Avatar, Box, Button, List, ListItem, Typography } from "@mui/material"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { useEffect, useState } from "react"
import { GroupApi } from "../api/group"
import { useNavigation } from "../../../hooks/useNavigation"

export type Group = {
	id: number
	group_name: string
	group_description: string
	group_icon: string | null
}

const Home = () => {
	const { toHome } = useNavigation()
	const user = useAuthContext()

	const [groups, setGroups] = useState<Group[]>([])
	useEffect(() => {
		;(async () => {
			if (!user) {
				return
			}

			const response = await GroupApi.getGroup()
			setGroups(response.data)
		})()

		// useEffect第二引数のuserは、user情報の取得が非同期であるためから配列にするとuser情報が取得される前にapiが叩かれてしまう。
	}, [user])

	const openGroup = async (groupId: number) => {
		try {
			const response = await GroupApi.activeGroup(groupId)
			alert(response.data.message)
		} catch (e) {
			console.error("アクションの実行に失敗しました。", e)
		}
	}

	if (!user) {
		toHome()
		return null
	} else {
		return (
			<Box>
				<Header />
				<List sx={{ paddingTop: "80px", paddingBottom: "80px" }}>
					{groups.map((group) => (
						<List
							key={group.id}
							sx={{
								display: "flex",
								border: "solid 1px  #E0E0E0",
								padding: "14px",
								borderTop: "none",
								alignItems: "center"
							}}
						>
							<Avatar
								sx={{
									marginTop: "3px",
									marginRight: "10px",
									marginLeft: "10px",
									sizes: "md"
								}}
								src={group.group_icon || undefined}
							/>
							<ListItem
								sx={{
									display: "flex",
									flexFlow: "column",
									alignItems: "flex-start"
								}}
							>
								<Typography variant="subtitle1" noWrap>
									{group.group_name}
								</Typography>
								<Typography variant="caption">メンバー: 5</Typography>
							</ListItem>
							<Button
								variant="contained"
								sx={{ height: 30 }}
								onClick={() => openGroup(group.id)}
							>
								開く
							</Button>
						</List>
					))}
				</List>

				<Footer />
			</Box>
		)
	}
}

export default Home
