import { Box, Button, FormControl, Skeleton, TextField } from "@mui/material"
import { signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { mutate } from "swr"
import Footer from "../../../components/Footer"
import Header from "../../../components/Header"
import { auth } from "../../../config/firebaseConfig"
import { useAlert } from "../../../provider/AlertProvider"
import { useAuthContext } from "../../../provider/AuthProvider"
import { useLoading } from "../../../provider/LoadingProvider"
import { ProfileApi } from "../api/profile"
import UserIcon from "./UserIcon"

export type UserProfileData = {
	userName: string
	userIcon: string | null | File
}

const Profile = () => {
	const user = useAuthContext()
	const { showAlert } = useAlert()

	const handleLogout = () => {
		signOut(auth)
	}

	const { control, handleSubmit, setValue } = useForm<UserProfileData>({
		mode: "onSubmit",
		defaultValues: {
			userName: "",
			userIcon: ""
		}
	})

	const [fileUrl, setFileUrl] = useState<string | File | null>(null)
	const { loading, setLoading } = useLoading()

	const onSubmit = async ({ userName, userIcon }: UserProfileData) => {
		try {
			setLoading(true)
			const Patchresponse = await ProfileApi.patchProfile({
				userName,
				userIcon
			})
			mutate("/api/profile")
			showAlert(Patchresponse.data.message, "success")
			const response = await ProfileApi.getProfile()
			const { newUserName, fileUrl } = response.data
			setFileUrl(fileUrl)
			setValue("userName", newUserName)
		} catch (error) {
			showAlert("予期せぬエラーが発生しました", "error")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		;(async () => {
			if (!user) {
				console.log("ログインしてません")
				return
			}
			setLoading(true)
			const getResponse = await ProfileApi.getProfile()
			const { newUserName, fileUrl } = getResponse.data
			setLoading(false)
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

			{loading ? (
				<FormControl
					component="form"
					variant="standard"
					sx={{ alignItems: "center" }}
				>
					<UserIcon setValue={setValue} value={fileUrl} loading={loading} />

					<Skeleton
						variant="rectangular"
						width={280}
						height={56}
						sx={{
							marginBottom: 7,
							borderRadius: 1
						}}
					/>

					<Skeleton
						variant="rectangular"
						width={280}
						height={40}
						sx={{
							borderRadius: 1,
							marginBottom: 16
						}}
					/>

					<Skeleton
						variant="rectangular"
						width={100}
						height={40}
						sx={{
							borderRadius: 1,
							marginBottom: 4
						}}
					/>
				</FormControl>
			) : (
				<>
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
				</>
			)}
			<Footer />
		</Box>
	)
}

export default Profile
