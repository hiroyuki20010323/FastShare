import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	updateProfile
} from "firebase/auth"
import { api, CustomAxiosRequestConfig } from "../../../lib/axios"
import { auth, provider } from "../../../config/firebaseConfig"
import { SignUpModalData } from "../components/SignUpModal"

export const AuthApi = {
	// グーグルログイン
	googleAuth: async () => {
		const userData = await signInWithPopup(auth, provider)
		const { displayName, photoURL, uid } = userData.user
		await api.post(`/api/user`, {
			displayName,
			photoURL,
			uid
		})
	},

	// メールアドレスログイン
	emailAndPasswordLogin: async (email: string, password: string) => {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		)
		await api.post(`/auth/verify`, { message: "認証に成功しました！" }, {
			tokenProvider: {
				type: "specific",
				user: userCredential.user
			}
		} as CustomAxiosRequestConfig)
	},

	signUp: async (email: string, password: string) => {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		)
		await api.post(`/auth/verify`, { message: "認証に成功しました！" }, {
			tokenProvider: {
				type: "specific",
				user: userCredential.user
			}
		} as CustomAxiosRequestConfig)
	},

	updateUserName: async (data: SignUpModalData) => {
		if (auth.currentUser) {
			const uid = auth.currentUser?.uid
			await updateProfile(auth.currentUser, {
				displayName: data.user_name
			})

			await api.post(`/api/user`, {
				uid: uid,
				displayName: data.user_name,
				icon_url: null
			})
		}
	}
}
