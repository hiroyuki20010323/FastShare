import { useNavigate } from "react-router-dom"

export const useNavigation = () => {
	const navigate = useNavigate()
	return {
		toHome: () => navigate("/"),
		toCreateGroup: () => navigate("/creategroup"),
		toTask: () => navigate("/task"),
		toLogin:() => navigate('/login')
	}
}
