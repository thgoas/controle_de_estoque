import multer from 'multer'
import path from 'path'
import { defineEventHandler } from 'h3'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext
      cb(null, name)
    }
  })

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
  fileFilter: (req, file, cb) => {  
    const allowed = /jpeg|jpg|png|webp/
    const ext = path.extname(file.originalname).toLowerCase()
    const mimetype = allowed.test(file.mimetype)
    if (mimetype && allowed.test(ext)) {
      return cb(null, true)
    }
    cb(new Error('Apenas imagens PNG, JPEG, JPG ou WEBP são permitidas'))
  }

})

export default defineEventHandler((event) => {
 
  return upload.single('image')(event.node.req as any, event.node.res as any, (err) => {
    if (err) {
      throw createError({
        statusCode: 400,
        statusMessage: err.message,
      })
    }
  })
})

