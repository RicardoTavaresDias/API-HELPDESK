import multer from "multer";
// import fs from "node:fs"
import { AppError } from "../utils/AppError";

const upload = multer({
  storage: multer.memoryStorage(),

  // storage: multer.diskStorage({
  //   // Caminho aonde será salvo no arquivo e criação de pasta tmp/upload.
  //   destination: (request, file, callback: any) => {
  //     try {
  //       if(!fs.existsSync("./upload")){
  //         fs.mkdirSync("./upload")
  //       }
  //       callback(null, "./upload")
  //     } catch(error){
  //       callback(new AppError("File server not found", 500), false)
  //     }
  //   },

  //   // Renpmeando o arquivo ou mantendo original descrição.
  //   filename: (request, file, callback) => {
  //     const time = new Date().getTime()
  //     callback(null, `${time}.${file.originalname.split(".")[1]}`)
  //   }
  // }),

  // Filtro de tipos de arquivo vai aceitar, exemplo a baixo somente imagens.
  fileFilter: (request, file, callback: any) => {
    const filter = [ "image/png", "image/jpg", "image/jpeg" ]
    if(filter.includes(file.mimetype)){
      callback(null, true)
    }else {
      callback(new AppError("Invalid file type", 401), false)
    }
  },

  // Limitando o tamnho de arquivo será carregado.
  limits: { fileSize: 100 * 1024 * 1024 }
})

export { upload }