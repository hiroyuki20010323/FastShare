import { AlertProvider } from "./provider/AlertProvider"
import { AuthProvider } from "./provider/AuthProvider"
import { LoadingProvider } from "./provider/LoadingProvider"
import { ProfileProvider } from "./provider/ProfileIconProvider"
import { TaskProvider } from "./provider/TaskProvider"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
	return (
		<>
			<AlertProvider>
				<AuthProvider>
					<LoadingProvider>
						<TaskProvider>
							<ProfileProvider>
								<AppRoutes />
							</ProfileProvider>
						</TaskProvider>
					</LoadingProvider>
				</AuthProvider>
			</AlertProvider>
		</>
	)
}

export default App
