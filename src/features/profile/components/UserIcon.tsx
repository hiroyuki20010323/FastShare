import { Avatar, Box } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { UseFormSetValue } from "react-hook-form"

type AvatarDataProps = {
	setValue: UseFormSetValue<any>
	value: any
}

const UserIcon = ({ setValue, value }: AvatarDataProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [profileIcon, setProfileIcon] = useState<string | null>()

	useEffect(() => {
		setProfileIcon(value)
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
		</Box>
	)
}

export default UserIcon
