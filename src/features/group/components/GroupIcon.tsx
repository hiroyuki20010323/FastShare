import { Avatar, Box } from "@mui/material"
import { useRef, useState } from "react"
import { UseFormSetValue } from "react-hook-form"

type AvatarDataProps = {
	setValue: UseFormSetValue<any>
	value: string
}

const GroupIcon = ({ setValue, value }: AvatarDataProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [icon, setIcon] = useState<string | undefined>(value)

	const handleInput = () => {
		const files = fileInputRef.current?.files
		if (!files) return
		const file = files[0]
		setValue("group_icon", file)
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = (e) => {
			setIcon(String(e.target?.result))
			console.log(icon)
		}
	}

	const fileUpload = () => {
		fileInputRef.current?.click()
	}

	return (
		<Box>
			<Avatar
				sx={{ width: 140, height: 140, marginTop: 4, marginBottom: 4 }}
				src={icon || undefined}
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
	)
}

export default GroupIcon
