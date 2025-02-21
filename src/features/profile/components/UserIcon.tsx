import { Avatar, Box, Skeleton } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { UseFormSetValue } from "react-hook-form"

type AvatarDataProps = {
	setValue: UseFormSetValue<{userIcon: File | string | null
		userName: string;
	}>
	value: File | string | null
	loading?: boolean
}

const UserIcon = ({ setValue, value, loading }: AvatarDataProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [profileIcon, setProfileIcon] = useState<string | null>()

	useEffect(() => {
		if (value instanceof File) {
			setProfileIcon(URL.createObjectURL(value))
		} else {
			setProfileIcon(value)
		}
	}, [value])

	const handleInput = () => {
		const files = fileInputRef.current?.files
		if (!files) return
		const file = files[0]
		setValue("userIcon", file)
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = (e) => {
			setProfileIcon(String(e.target?.result))
		}
	}

	const fileUpLoad = () => {
		fileInputRef.current?.click()
	}

	return (
		<Box>
			{loading ? (
				<Skeleton
					variant="circular"
					width={140}
					height={140}
					sx={{ marginTop: 10, marginBottom: 10 }}
				/>
			) : (
				<>
					<Avatar
						sx={{ width: 140, height: 140, marginTop: 10, marginBottom: 10 }}
						src={profileIcon || undefined}
						onClick={fileUpLoad}
					/>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleInput}
						style={{
							display: "none"
						}}
					/>
				</>
			)}
		</Box>
	)
}

export default UserIcon
