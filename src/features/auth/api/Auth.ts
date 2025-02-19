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
		return  await api.post(`/auth/user`, {
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
		const {data} =await api.post(`/auth/verify`,{
			tokenProvider: {
				type: "specific",
				user: userCredential.user
			}
		} as CustomAxiosRequestConfig)
		
		return data
	},

	// 新規登録
	signUp: async (email: string, password: string) => {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		)
		  return await api.post(`/auth/verify`, {
			tokenProvider: {
				type: "specific",
				user: userCredential.user
			}
		} as CustomAxiosRequestConfig)
		
	},

	// ユーザーネーム入力モーダル
	updateUserName: async (data: SignUpModalData) => {
		if (auth.currentUser) {
			const uid = auth.currentUser?.uid
				await updateProfile(auth.currentUser, {
				displayName: data.user_name
			})

		return await api.post(`/auth/user`, {
				uid: uid,
				displayName: data.user_name,
				icon_url: null
			})
		
		}
	}
}
