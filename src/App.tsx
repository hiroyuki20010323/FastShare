import { AlertProvider } from "./provider/AlertProvider"
import { AuthProvider } from "./provider/AuthProvider"
import { GroupIconProvider } from "./provider/GroupIconProvider"
import { LoadingProvider } from "./provider/LoadingProvider"
import { ProfileIconProvider } from "./provider/ProfileIconProvider"
import { TaskProvider } from "./provider/TaskProvider"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
	return (
		<>
			<AlertProvider>
				<AuthProvider>
					<LoadingProvider>
						<TaskProvider>
							<ProfileIconProvider>
								<GroupIconProvider>
									<AppRoutes />
								</GroupIconProvider>
							</ProfileIconProvider>
						</TaskProvider>
					</LoadingProvider>
				</AuthProvider>
			</AlertProvider>
		</>
	)
}

export default App
