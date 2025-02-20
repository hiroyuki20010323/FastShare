import { useState } from "react"

export const usePasswordVisibility = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	// パスワード表示＆非表示
	const togglePassword = () => setShowPassword((prev) => !prev)

	// 確認用パスワード表示＆非表示
	const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev)

	return {
		showPassword,
		showConfirmPassword,
		togglePassword,
		toggleConfirmPassword
	}
}
