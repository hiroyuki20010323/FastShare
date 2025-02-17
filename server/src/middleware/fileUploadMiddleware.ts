import multer from "multer"
import multerS3 from "multer-s3"
import { v4 as uuidv4 } from "uuid"
import { s3 } from "../config/S3Client"

export const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.S3_BUCKET_NAME!,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname })
		},
		key: function (req, file, cb) {
			const uniqueFileName = `${uuidv4()}-${file.originalname}`
			// TODOuserIconというパスに画像関係を全てアップロードしてしまっているため、あとでパスを切る
			const filePath = `userIcon/${uniqueFileName}`
			cb(null, filePath)
		}
	})
})