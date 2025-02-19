import { createContext, useContext, ReactNode, useState } from "react"
import { Alert, Snackbar } from "@mui/material"

type AlertContextType = {
	showAlert: (message: string, severity?: "success" | "error") => void
	hideAlert: () => void
}

const AlertContext = createContext<AlertContextType>({
	showAlert: () => {},
	hideAlert: () => {}
})

export const AlertProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState("")
	const [severity, setSeverity] = useState<"success" | "error">("success")

	const showAlert = (
		message: string,
		severity: "success" | "error" = "success"
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
				autoHideDuration={2000}
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
