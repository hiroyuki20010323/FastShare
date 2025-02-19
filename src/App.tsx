import { AlertProvider } from "./provider/AlertProvider"
import { AuthProvider } from "./provider/AuthProvider"
import { LoadingProvider } from "./provider/LoadingProvider"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
	return (
		<>
		<AlertProvider>		
			<AuthProvider>
				<LoadingProvider>
				<AppRoutes />
				</LoadingProvider>
			</AuthProvider>
			</AlertProvider>
		</>
	)
}

export default App
