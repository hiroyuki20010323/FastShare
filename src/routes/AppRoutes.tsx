import { Route, Routes } from "react-router-dom"

import InviteChecker from "../features/invitation/components/InviteChecker"
import { AuthProvider } from "../provider/AuthProvider"
import NeedAuthRoutes from "../needAuthRoutes"

const AppRoutes = () => {
	return (
		<Routes>
			{/* 認証状態の監視が不要なルート */}
			<Route path="/invitechecker" element={<InviteChecker />} />

			{/* 認証の監視が必要なルート */}
			<Route path="/*" element={
        <AuthProvider>
          <NeedAuthRoutes/>
        </AuthProvider>
      } />
		</Routes>
	)
}

export default AppRoutes
