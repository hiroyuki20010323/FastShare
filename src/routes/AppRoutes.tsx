import { Route, Routes } from "react-router-dom"

import InviteChecker from "../features/invitation/components/InviteChecker"
import { AuthProvider } from "../provider/AuthProvider"
import NeedAuthRoutes from "../NeedAuthRoutes"
import { SignUp } from "../features/auth/components/signUp"
import Login from "../features/auth/components/Login"


const AppRoutes = () => {
	return (
		<Routes>
			{/* 認証状態の監視が不要なルート */}
			<Route path="/invitechecker" element={<InviteChecker />} />
			<Route path="/signup" element={<SignUp />} />
			<Route path="/login" element={<Login />} />
			
			{/* 認証の監視が必要なルート */}
			<Route
				path="/*"
				element={
					<AuthProvider>
						<NeedAuthRoutes />
					</AuthProvider>
				}
			/>
		</Routes>
	)
}

export default AppRoutes
