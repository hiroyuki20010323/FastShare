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
	// グーグルログイン　だが、データを自前のDBに保存するため、実態は新規登録
	googleAuth: async () => {
		const userData = await signInWithPopup(auth, provider)
		const { displayName, photoURL, uid } = userData.user
		await api.post(`/auth/user`, {
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

	// 新規登録だが、実際にはupdateUserNameで登録の振る舞いをしている。こちらは認証的な役割を持つ
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

	// ここで新規登録
	updateUserName: async (data: SignUpModalData) => {
		if (auth.currentUser) {
			const uid = auth.currentUser?.uid
			await updateProfile(auth.currentUser, {
				displayName: data.user_name
			})

			await api.post(`/auth/user`, {
				uid: uid,
				displayName: data.user_name,
				icon_url: null
			})
		}
	}
}
