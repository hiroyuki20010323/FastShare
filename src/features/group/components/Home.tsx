import { useAuthContext } from "../../../provider/AuthProvider"
import { Avatar, Box, Button, List, ListItem, Typography } from "@mui/material"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { useEffect, useState } from "react"
import { GroupApi } from "../api/group"
import { useLoading } from "../../../provider/LoadingProvider"
import { useAlert } from "../../../provider/AlertProvider"
import { mutate } from "swr"
import GroupListSkeleton from "./GroupListSkeleton"

export type Group = {
	id: number
	group_name: string
	group_description: string
	group_icon: string | null
}

const Home = () => {
	const { loading, setLoading } = useLoading()
	const [isLoading, setIsLoading] = useState<number | null>(null)
	const user = useAuthContext()
	const { showAlert } = useAlert()
	const [groups, setGroups] = useState<Group[]>([])
	useEffect(() => {
		;(async () => {
			if (!user) {
				return
			}
			try {
				setLoading(true)
				const response = await GroupApi.getGroup()
				// TODO ログインログアウト時叩かれて、エラーが出るので修正する
				setGroups(response.data)
			} finally {
				setLoading(false)
			}
		})()
		// useEffect第二引数のuserは、user情報の取得が非同期であるためから配列にするとuser情報が取得される前にapiが叩かれてしまう。
	}, [user])

	useEffect(() => {
		;(async () => {
			const activeGroupData = await GroupApi.getActiveGroup()
			setIsLoading(activeGroupData.data.id)
		})()
	}, [location.pathname === "/"])

	const openGroup = async (groupId: number) => {
		try {
			const response = await GroupApi.activeGroup(groupId)
			setIsLoading(groupId)
			showAlert(response.data.message, "info")
			mutate("/api/open-group")
		} catch (e) {
			console.error("アクションの実行に失敗しました。", e)
		}
	}

	return (
		<Box>
			<Header />
			<List sx={{ paddingTop: "80px", paddingBottom: "80px" }}>
				{loading
					? Array(10)
							.fill(0)
							.map((_, index) => <GroupListSkeleton key={index} />)
					: groups.map((group) => (
							<List
								key={group.id}
								sx={{
									margin: 0,
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
									disabled={isLoading === group.id}
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

export default Home
