import { Route, Routes } from "react-router-dom"
import CreateGroup from "./features/group/components/CreateGroup"
import GroupSettings from "./features/group/components/GroupSettings"
import Home from "./features/group/components/Home"
import Invitations from "./features/invitation/components/Invitations"
import Notification from "./features/notification/components/Notification"
import Profile from "./features/profile/components"
import Task from "./features/task/components/Task"

const NeedAuthRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/creategroup" element={<CreateGroup />} />
			<Route path="/notification" element={<Notification />} />
			<Route path="/invitation" element={<Invitations />} />
			<Route path="/groupsettings" element={<GroupSettings />} />
			<Route path="/task" element={<Task />} />
		</Routes>
	)
}

export default NeedAuthRoutes
