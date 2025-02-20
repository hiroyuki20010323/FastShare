import { API_URL } from "../config"
import axios, {
	AxiosRequestConfig,
	InternalAxiosRequestConfig as OriginalInternalAxiosRequestConfig
} from "axios"
import { auth } from "../config/firebaseConfig"
import { onAuthStateChanged, User } from "firebase/auth"

export type InternalAxiosRequestConfig = OriginalInternalAxiosRequestConfig & {
	requiresAuth?: boolean
	tokenProvider?: TokenProvider
}

type TokenProvider = {
	type: "specific"
	user?: User
}

export type CustomAxiosRequestConfig = AxiosRequestConfig & {
	requiresAuth?: boolean
	tokenProvider?: TokenProvider
}

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json"
	}
})

api.interceptors.request.use((config) => {
	if (config.data instanceof FormData) {
		config.headers["Content-Type"] = "multipart/form-data"
	}
	return config
})

api.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		if (config.requiresAuth !== false) {
			await new Promise<void>((resolve) => {
				const unsubscribe = onAuthStateChanged(auth, () => {
					unsubscribe()
					resolve()
				})
			})
			const token =
				config.tokenProvider?.type === "specific"
					? await config.tokenProvider.user?.getIdToken(true)
					: await auth.currentUser?.getIdToken()

			if (token && !config.headers?.Authorization) {
				config.headers = config.headers || {}
				config.headers.Authorization = `Bearer ${token}`
			}
		}
		return config
	},
	(error) => Promise.reject(error)
)
