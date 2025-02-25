import type { NextFunction, Request, Response } from "express"
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import { verification } from "../../config/firebaseAdmin"

// リクエストの拡張
declare global {
	namespace Express {
		interface Request {
			user: DecodedIdToken
		}
	}
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split("Bearer ")[1]
	if (!token) {
		res.status(401).json({ message: "トークンがありません" })
		return
	}

	try {
		const decodedToken = await verification.auth().verifyIdToken(token)
		req.user = decodedToken
		next()
	} catch (error) {
		res.status(403).json({ message: "トークンが無効です" })
	}
}
