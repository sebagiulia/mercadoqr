
import express, { json, urlencoded } from 'express'
import { errorHandler } from './errors/errorHandler'
//import { connectDB, sequelize } from "./config/database";



import PlaceController from './controllers/PlaceController'
import PlaceServiceJSON from './services/imp/PlaceServiceJSON'
import PlaceRepositoryJSON from './repositories/imp/placeRepositoryJSON';
const placeRepository = new PlaceRepositoryJSON ()
const placeService = new PlaceServiceJSON(placeRepository)
const placeController = new PlaceController(placeService)

import QrRepositoryJSON from './repositories/imp/qrRepositoryJSON';
const qrRepository = new QrRepositoryJSON()
import QrController from './controllers/QrController'
import QrServiceImp from './services/imp/QrServiceApi'
const qrService = new QrServiceImp(qrRepository, placeRepository)
const qrController = new QrController(qrService)

import ScannController from './controllers/ScannController'
import ScannServiceJSON from './services/imp/ScannServiceJSON'
import ScannRepositoryJSON from './repositories/imp/scannRepositoryJSON'
const scannRepository = new ScannRepositoryJSON()
const scannService = new ScannServiceJSON(qrRepository, placeRepository, scannRepository)
const scannController = new ScannController(scannService)

import NotifierDefault from './services/imp/NotifierDefault'
const notifierService = new NotifierDefault()


import MercadoPagoController from './controllers/MercadoPagoController'
import MercadoPagoServiceDefault from './services/imp/MercadoPagoServiceDefault'
    import MercadoPagoRepositoryJSON from './repositories/imp/mercadoPagoRepositoryJSON';
const mercadoPagoRepository = new MercadoPagoRepositoryJSON()
const mercadoPagoService = new MercadoPagoServiceDefault(placeRepository, mercadoPagoRepository, notifierService, qrService)
const mercadoPagoController = new MercadoPagoController(mercadoPagoService, placeService)

import cors from 'cors'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 8080


app.use(cors())
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.json('Hello World!')
} )

// Place & Product
app.get('/api/place/:place', placeController.getPlace)
app.get('/api/places/:place', placeController.getPlaces)
app.get('/api/product/:place/:product', placeController.getProduct)
app.get('/api/products/:id/:category', placeController.getProducts)
app.get('/api/categories/:place', placeController.getCategories)

// POST

// Place
app.post('/api/place/create', placeController.createPlace)

// Scann
app.get('/api/scann/consume/:id', scannController.consumeQrByQrId)
app.get('/api/scann/getprod/:id', qrController.getQrById)
app.post('/api/scann/validate', scannController.validateScanner)

// MercadoPago
app.post('/api/mp/getInitPoint', mercadoPagoController.getInitPoint)
app.post('/api/mp/notify/:payment_id', mercadoPagoController.processMPNotification)

// Middleware de errores
app.use(errorHandler);


//connectDB()
//sequelize.sync().then(() => {
//    console.log("✅ Modelos sincronizados"); 
//      });
    
//import DBtest from './data/dbStore'
//DBtest() /* Actualiza de 0 la base de datos */


app.listen(port, () => {
    console.log(`Servidor mercadoqr levantado en puerto ${port}`)
})