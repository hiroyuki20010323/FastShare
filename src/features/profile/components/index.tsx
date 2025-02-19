import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { signOut } from "firebase/auth"
import { auth } from "../../../config/firebaseConfig"
import { Box, Button, FormControl, TextField } from "@mui/material"
import UserIcon from "./UserIcon"
import { useForm, Controller } from "react-hook-form"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../provider/AuthProvider"
import { ProfileApi } from "../api/profile"
import { useNavigation } from "../../../hooks/useNavigation"

export type UserProfileData = {
	userName: string
	userIcon: string
}

const Profile = () => {
	const user = useAuthContext()
	const { toHome } = useNavigation()

	const handleLogout = () => {
		signOut(auth)
		toHome()
	}

	const { control, handleSubmit, setValue } = useForm({
		mode: "onSubmit",
		defaultValues: {
			userName: "",
			userIcon: ""
		}
	})

	const [fileUrl, setFileUrl] = useState(null)

	const onSubmit = async ({ userName, userIcon }: UserProfileData) => {
		try {
			await ProfileApi.patchProfile({ userName, userIcon })
			const getResponse = await ProfileApi.getProfile()
			const { newUserName, fileUrl } = getResponse.data
			setFileUrl(fileUrl)
			setValue("userName", newUserName)
		} catch (error) {
			console.log("アップロードに失敗しました", error)
		}
	}

	useEffect(() => {
		;(async () => {
			if (!user) {
				console.log("ログインしてません")
				return
			}
			const getResponse = await ProfileApi.getProfile()
			const { newUserName, fileUrl } = getResponse.data
			setFileUrl(fileUrl)
			setValue("userName", newUserName)
		})()
	}, [user])





	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				flexFlow: "column",
				paddingTop: "80px",
				paddingBottom: "80px"
			}}
		>
			<Header />

			<FormControl
				encType="multipart/form-data"
				component="form"
				variant="standard"
				sx={{ alignItems: "center" }}
				onSubmit={handleSubmit(onSubmit)}
			>
				<UserIcon setValue={setValue} value={fileUrl} />
				<Controller
					name="userName"
					control={control}
					rules={{ required: { value: true, message: "入力は必須です" } }}
					render={({ field, formState: { errors } }) => (
						<TextField
							{...field}
							id="outline-disabled"
							label="ユーザーネーム"
							style={{ width: 280, marginBottom: 50 }}
							error={errors.userName ? true : false}
							helperText={errors.userName?.message as string}
						/>
					)}
				/>

				<Button
					variant="contained"
					sx={{ width: 280, height: 40 }}
					onClick={handleSubmit(onSubmit)}
				>
					保存
				</Button>
			</FormControl>

			<Button
				variant="outlined"
				color="error"
				sx={{ marginTop: 22, marginBottom: 4 }}
				onClick={handleLogout}
			>
				ログアウト
			</Button>
			<Footer />
		</Box>
	)
}

export default Profile
