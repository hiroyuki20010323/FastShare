import { CssBaseline } from "@mui/material"
import { AlertProvider } from "./provider/AlertProvider"
import { LoadingProvider } from "./provider/LoadingProvider"
import { TaskProvider } from "./provider/TaskProvider"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
	return (
		<>
			<AlertProvider>
				<LoadingProvider>
					<TaskProvider>
						<CssBaseline />
						<AppRoutes />
					</TaskProvider>
				</LoadingProvider>
			</AlertProvider>
		</>
	)
}

export default App
