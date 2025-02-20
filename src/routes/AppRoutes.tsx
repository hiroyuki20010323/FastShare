import { Route, Routes } from "react-router-dom"
import Home from "../features/group/components/Home"
import { SignUp } from "../features/auth/components/signUp"
import Login from "../features/auth/components/Login"
import Profile from "../features/profile/components"
import CreateGroup from "../features/group/components/CreateGroup"
import Invitations from "../features/invitation/components/Invitations"
import GroupSettings from "../features/group/components/GroupSettings"
import Task from "../features/task/components/Task"
import Notification from "../features/notification/components/Notification"

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/signup" element={<SignUp />} />
			<Route path="/login" element={<Login />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/creategroup" element={<CreateGroup />} />
			<Route path="/notification" element={<Notification />} />
			<Route path="/invitation" element={<Invitations />} />
			<Route path="/groupsettings" element={<GroupSettings />} />
			<Route path="/task" element={<Task />} />
		</Routes>
	)
}

export default AppRoutes
