import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../config/firebaseConfig"
import { useNavigate } from "react-router-dom"
import Loading from "../components/Loading"

const AuthContext = createContext<User | null>(null)

export const useAuthContext = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate()
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const unsubscribed = onAuthStateChanged(auth, (user: User | null) => {
			if (user) {
				setUser(user)
				setLoading(false)
			} else {
				setUser(null)
				navigate("/login")
				setLoading(false)
			}
		})

		return () => {
			unsubscribed()
		}
	}, [])

	if (loading) {
		return <Loading />
	}

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
