import { Alert, Snackbar } from "@mui/material"
import { type ReactNode, createContext, useContext, useState } from "react"

type AlertContextType = {
	showAlert: (message: string, severity?: "success" | "error" | "info") => void
	hideAlert: () => void
}

const AlertContext = createContext<AlertContextType>({
	showAlert: () => {},
	hideAlert: () => {}
})

export const AlertProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState("")
	const [severity, setSeverity] = useState<"success" | "error" | "info">(
		"success"
	)

	const showAlert = (
		message: string,
		severity: "success" | "error" | "info" = "success"
	) => {
		setMessage(message)
		setSeverity(severity)
		setOpen(true)
	}

	const hideAlert = () => {
		setOpen(false)
	}

	return (
		<AlertContext.Provider value={{ showAlert, hideAlert }}>
			{children}
			<Snackbar
				open={open}
				autoHideDuration={1000}
				onClose={hideAlert}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert variant="filled" severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</AlertContext.Provider>
	)
}

export const useAlert = () => useContext(AlertContext)
