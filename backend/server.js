import express, { urlencoded, json } from 'express';
import { UserController } from './controllers/register.js';
import { LoginController } from './controllers/login.js';
import { PlaceController } from './controllers/place.js';
import { ProductController } from './controllers/product.js';
import cors from 'cors';
import { verifyToken } from './middleware/token.js';
import path from 'path'

import dotenv from 'dotenv';
dotenv.config();


import multer from 'multer'
// Configuración de multer
const storageProfile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/places/profile'); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const storageProduct = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/places/products'); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});



const uploadProfile = multer({ storage: storageProfile });
const uploadProducts = multer({ storage: storageProduct });

const srv = express();

// Middleware para servir archivos estáticos (en este caso, imágenes)
srv.use(express.static('public'));
srv.use('/profile-images', express.static('public/places/profile'));
srv.use('/product-images', express.static('public/places/products'));

srv.use(urlencoded({ extended: true }));
srv.use(json());
srv.use(cors());

srv.get("/token", verifyToken);
srv.get("/api/place/:place_name", PlaceController.getPlaceDataByPlaceName);
srv.get("/api/places/:place_name", PlaceController.findPlaces);
srv.post("/api/qrplace", PlaceController.getQrListFromUserId);
srv.post("/api/subscribe", PlaceController.subscribeToPlace);
srv.post("/api/buyqr", PlaceController.buyqr);
srv.post("/api/qrs", PlaceController.getqrs);
srv.post("/api/subs", PlaceController.getsubs);
srv.post("/api/userplaces", PlaceController.getplaces);
srv.post("/api/unsubscribe", PlaceController.unsubscribeToPlace);
srv.post("/api/raiseprod", uploadProducts.single('img'), ProductController.raiseProd);
srv.post("/api/create", uploadProfile.single('img'), PlaceController.createPlace);
srv.post("/api/userplace", UserController.getUserDataFromPlace);
srv.post("/register", UserController.createUser);
srv.post("/login", LoginController.matchLogin);



srv.listen(process.env.PORT, () => {
    console.log("Escuchando en puerto " + process.env.PORT);
})

