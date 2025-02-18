import express, { Request, Response } from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import profileRoutes from "./routes/profileRoutes"
import groupRoutes from "./routes/groupRoutes"
import taskRoutes from "./routes/taskRoutes"

const app = express()
const PORT = 3080

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ヘルスチェック用
app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Hello Fast Share!!!!")
})
app.use("/auth", authRoutes)

app.use("/api", profileRoutes)
app.use("/api", groupRoutes)
app.use("/api", taskRoutes)

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`)
})
