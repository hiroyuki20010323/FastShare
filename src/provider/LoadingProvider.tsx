import { createContext, ReactNode, useContext, useState } from "react"

type LoadingContextType = {
	loading: boolean
	setLoading: (value: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
	loading: false,
	setLoading: () => {}
})

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
	const [loading, setLoading] = useState<boolean>(false)

	return (
		<LoadingContext.Provider value={{ loading, setLoading }}>
			{children}
		</LoadingContext.Provider>
	)
}

export const useLoading = () => useContext(LoadingContext)
