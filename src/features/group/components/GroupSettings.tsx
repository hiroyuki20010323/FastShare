import Header from "../../../components/Header"
import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	FormControl,
	TextField,
	Typography
} from "@mui/material"
import Footer from "../../../components/Footer"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../../provider/AuthProvider"
import { useEffect, useRef } from "react"
import Loading from "../../../components/Loading"
import { Controller, useForm } from "react-hook-form"
import useGroup from "../hooks/useGroup"
import { GroupApi } from "../api/group"
import { useGroupIconContext } from "../../../provider/GroupIconProvider"

export type FormInputs = {
	group_name: string
	group_icon: File | string | null
	group_description: string
}

const GroupSettings = () => {
	const user = useAuthContext()
	const { groupData, groupEdit, setGroupData, groupDelete } = useGroup()
	const { groupIcon, setGroupIcon } = useGroupIconContext()
	const { control, handleSubmit, setValue } = useForm<FormInputs>({
		mode: "onSubmit",
		defaultValues: {
			group_icon: "",
			group_name: "",
			group_description: ""
		}
	})

	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const handleInput = () => {
		const files = fileInputRef.current?.files
		if (!files) return
		const file = files[0]
		const reader = new FileReader()
		setValue("group_icon", file)
		reader.readAsDataURL(file)
		reader.onload = (e) => {
			setGroupIcon(e.target?.result as string)
		}
	}

	const fileUpload = () => {
		fileInputRef.current?.click()
	}
	const onDelete = async (groupId: number) => groupDelete(groupId)

	const onSubmit = ({
		group_icon,
		group_name,
		group_description
	}: FormInputs) => {
		groupEdit({
			group_icon,
			group_name,
			group_description
		})
	}

	useEffect(() => {
		;(async () => {
			if (!user) {
				return
			}
			const response = await GroupApi.getActiveGroup()
			setValue("group_name", response.data.group_name)
			setValue("group_description", response.data.group_description)
			setGroupIcon(response.data.group_icon)
			setGroupData(response.data)
		})()

		// useEffect第二引数のuserは、user情報の取得が非同期であるためから配列にするとuser情報が取得される前にapiが叩かれてしまう。
	}, [user])

	if (!groupData) {
		return <Loading />
	}

	return (
		<>
			<Header />
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexFlow: "column",
					paddingTop: "80px",
					paddingBottom: "80px"
				}}
			>
				<FormControl
					component="form"
					variant="standard"
					onSubmit={handleSubmit(onSubmit)}
				>
					<Box sx={{ display: "flex", justifyContent: "center" }}>
						<Avatar
							sx={{ width: 140, height: 140, marginTop: 4, marginBottom: 4 }}
							src={groupIcon || "" || undefined}
							onClick={fileUpload}
						/>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleInput}
							style={{
								display: "none"
							}}
						/>
					</Box>

					<Controller
						name="group_name"
						control={control}
						rules={{ required: { value: true, message: "入力は必須です" } }}
						render={({ field, formState: { errors } }) => (
							<TextField
								{...field}
								id="outline-disabled"
								label="グループネーム"
								error={errors.group_name ? true : false}
								style={{ width: 280, marginBottom: 50 }}
								helperText={errors.group_name?.message as string}
							/>
						)}
					/>
					<Controller
						name="group_description"
						control={control}
						rules={{ required: { value: false, message: "入力は必須です" } }}
						render={({ field, formState: { errors } }) => (
							<TextField
								{...field}
								id="outlined-multiline-static"
								label="グループ説明"
								multiline
								rows={8}
								error={errors.group_description ? true : false}
								sx={{ marginBottom: 4 }}
								helperText={errors.group_description?.message as string}
							/>
						)}
					/>
					<Typography>メンバー</Typography>
					<Box sx={{ display: "flex", justifyContent: "flex-start" }}>
						<AvatarGroup total={8}>
							<Avatar />
							<Avatar />
							<Avatar />
							<Avatar />
							<Avatar />
						</AvatarGroup>
					</Box>

					<Button
						variant="contained"
						sx={{ height: 40, marginTop: 10 }}
						onClick={handleSubmit(onSubmit)}
					>
						保存
					</Button>
					<Button
						variant="outlined"
						sx={{ height: 40, marginTop: 4, marginBottom: 8 }}
						component={Link}
						to="/invitation"
					>
						招待
					</Button>
					<Button
						variant="outlined"
						color="error"
						sx={{ marginTop: 12, marginBottom: 4 }}
						onClick={() => onDelete(groupData.id)}
					>
						グループ削除
					</Button>
				</FormControl>
			</Box>
			<Footer />
		</>
	)
}

export default GroupSettings
