import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
	Toolbar,
	Typography
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import Loading from "../../../components/Loading"
import { useAuth } from "../hooks/useAuth"
import { usePasswordVisibility } from "../hooks/useForm"
import SignUpModal from "./SignUpModal"

type UserData = {
	email: string
	password: string
	confirmPassword: string
}

export const SignUp = () => {
	const { loading, handleGoogleLogin, signUp, isOpenModal } = useAuth()
	const {
		showPassword,
		showConfirmPassword,
		togglePassword,
		toggleConfirmPassword
	} = usePasswordVisibility()

	const { handleSubmit, control, watch } = useForm({
		mode: "onSubmit",
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: ""
		}
	})
	const password = watch("password")

	const handleClickShowPassword = () => togglePassword()

	const handleClickConfirmShowPassword = () => toggleConfirmPassword()

	const onSubmit = ({ email, password }: UserData) => signUp(email, password)

	if (loading) {
		return <Loading />
	}

	return (
		<Box display="flex" flexDirection="column" alignItems="center">
			<AppBar
				elevation={0}
				sx={{
					width: "100vw",
					top: 0,
					height: "68px",
					backgroundColor: "white",
					pb: 0.6,
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.06)",
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
						FastShare
					</Typography>
				</Toolbar>
			</AppBar>
			<Typography variant="h4" marginTop={12}>
				新規登録
			</Typography>
			<Typography variant="subtitle1" marginTop={5}>
				ログインは<Link to={"/login"}>こちら</Link>
			</Typography>

			<Box
				component="form"
				flexDirection="column"
				display="flex"
				alignItems="center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="email"
					control={control}
					rules={{
						required: "入力は必須です!",
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: "有効なメールアドレスを入力してください"
						}
					}}
					render={({ field, formState: { errors } }) => (
						<TextField
							{...field}
							name="email"
							type="email"
							label="メールアドレス"
							sx={{ width: 300, margin: 3 }}
							error={errors.email ? true : false}
							helperText={errors.email?.message}
						/>
					)}
				/>

				<FormControl variant="outlined" sx={{ width: 300, margin: 3 }}>
					<Controller
						name="password"
						control={control}
						rules={{
							required: "パスワードは必須です!",
							minLength: {
								value: 8,
								message: "パスワードは8文字以上で入力してください!"
							}
						}}
						render={({ field, formState: { errors } }) => (
							<>
								<InputLabel>パスワード</InputLabel>
								<OutlinedInput
									{...field}
									label="パスワード"
									name="password"
									id="outlined-adornment-password"
									type={showPassword ? "text" : "password"}
									endAdornment={
										<InputAdornment position="end">
											<IconButton onClick={handleClickShowPassword}>
												{showPassword ? (
													<VisibilityIcon />
												) : (
													<VisibilityOffIcon />
												)}
											</IconButton>
										</InputAdornment>
									}
									error={errors.password ? true : false}
								/>
								{errors.password && (
									<FormHelperText error>
										{errors.password.message}
									</FormHelperText>
								)}
							</>
						)}
					/>
				</FormControl>

				<FormControl variant="outlined" sx={{ width: 300, margin: 3 }}>
					<Controller
						name="confirmPassword"
						control={control}
						rules={{
							required: "確認用パスワードは必須です!",
							validate: (value) =>
								value == password || "パスワードが一致しません"
						}}
						render={({ field, formState: { errors } }) => (
							<>
								<InputLabel>確認用パスワード</InputLabel>

								<OutlinedInput
									{...field}
									name="confirmPassword"
									label="確認用パスワード"
									id="outlined-adornment-password"
									type={showConfirmPassword ? "text" : "password"}
									endAdornment={
										<InputAdornment position="end">
											<IconButton onClick={handleClickConfirmShowPassword}>
												{showConfirmPassword ? (
													<VisibilityIcon />
												) : (
													<VisibilityOffIcon />
												)}
											</IconButton>
										</InputAdornment>
									}
									error={errors.confirmPassword ? true : false}
								/>
								{errors.confirmPassword && (
									<FormHelperText error>
										{errors.confirmPassword.message}
									</FormHelperText>
								)}
							</>
						)}
					/>
				</FormControl>

				<Button
					type="submit"
					variant="contained"
					sx={{ width: 300, margin: 3 }}
					size="large"
				>
					新規登録
				</Button>
			</Box>
			<Divider component="div" sx={{ width: "100%" }}>
				または
			</Divider>

			<Button
				variant="contained"
				onClick={handleGoogleLogin}
				sx={{
					width: 300,
					height: 50,
					margin: 3,
					color: "#e3f2fd",
					backgroundColor: "#e3f2fd",
					"&:hover": {
						backgroundColor: "#bbdefb"
					}
				}}
			>
				<Avatar
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEkUlEQVR4nO2Zb0wbZRzHn3taesUtRpOJYbo/DoQM5c/GMgryzxkYxbGBiQsbNBCEFGaIY8zCCuaUMSiQAQMGQWAgcSY2GeuNuzpc8NqNvRoCItE3841Dthj3ToNzbX+mVRBI197Zo2VJv8n3XZ+nn89dn6dPrwj5448/HgcoJIWqgGIoxywU4HuQTfwJSsIKBxBAKgJIQzbIJhZBhX+BE/g6VAUU2ccgXwc0UgWU4tvwNmGBJASCqiQsoMa3QRsQ433wOlk4qPEsvCkQ2llTEUAxnoEaFOIdeA3RCumEzWPwtT2IrHCK0K0f+HkUCMX4B9HBk9b0PTwNFJKJC9+NngcVfrDu8En/toJoFw9+EMnhOPGr1+DLCE40eIeAGn/vPXgsMvyHRIfgrbEMT0IlroUmaQpQaAtQKAjOSN6C05hy7Db21zgbW4pN4sI3kyGQQVh5g5+W9PJZfEChZ+ADydAqkVKR4R1vVIHv8IIvwPNwDr0oeP4aFAJ5+P76wJvl22CcfAQaCUCyC/gSPAV6JEEbLWAmdWAmwdHeAIB0wvmV35DweiQBs2x+WcDeURmACv8Hn0lYoAK9hDZiwCSPXwW/VI4E0En/ObuclPSjjRowybROBZY6FPAAyhGJNmrATF5xKWCSdQiZL1gzC2I0XDthO9rUd9e9gImccynAkRm+EAjWzMIbddcW+Qg8dCMQ6iuB3TW3rHwEHrkWQJt9JbCjehKeaoHtVd+C5x+hm7IwXwns1t60Pd2L+JNRHovYTI642UY7fSVwRDc8z0NAduZJ8A+5Z6Geif/jvF4RiEROy3D+puiPvrG4Eii/0DjqXoALVDiDnx0PBhWthENXs6HDGHtJbIGTnfX97u6Arq/iuHsBQBjMsntL4DYzCfRYOGQbDjvg7c2jlZaL11/bJhZ8W496Z2SNyeoK/vVas4XiKH5P88BENtrhfzdthrNMwjL4ylaPJi9wXIrHjwcpjpIeafxswd3VL2lrm+A9KXCBL98df+GvEjrdKfxSP2YTZjyRoDhKmt/SM+d2/6+egsbuylhBkzcwihlX8CvvRP/X4VuFwvfeiNhe1lX3E5/d51hz75zQ+RE9FvZKPq208pHIp5WWzq/2DlCDKXJ38w6PRW1qZ/b15RmU1pyRHDja2uH2FEp9ekrQl+dyutmY1iweAitFGljFdJdxL6VnIw5cGdsVdJkL2zJgjEq8aNxTV8ckTNpfs3JM1kgOFPZQsLXqO6cC77c3dSNPomPjpvkKeNKiwXLYWX1nFfy7TQM/Ik+j10fINHTqfW9IFH5RCJG1Jgd8ev2Xv53o6hJ0cHxiOG7HczVM4oI3JI7pc0HVemGeGq4MEgV+hYT8LBM/K2RN/J+eYxXTRmPo+v3m7jNGNecaMq2iX3lDprWXjWlG3sgwvSe0gY2beseQ5TF4ztXDjqt++caru5C3MzQWGdvM7L9VZDj4WCh4AZ3xuJGJm/icifb+n3xrowck6WeiC1uN+0a1TOLPajptUWVQWu13yH4IzDVk2tSGtMWqa8nzLex+ts8YU2Afg/zxxx/kaf4GzSVnCicBYF0AAAAASUVORK5CYII="
					alt="Google"
					sx={{ mr: 2, width: 28, height: 28 }}
				/>
				<Typography
					variant="button"
					sx={{ color: "black", textTransform: "none" }}
				>
					Googleログイン
				</Typography>
			</Button>

			{isOpenModal && <SignUpModal />}
		</Box>
	)
}
