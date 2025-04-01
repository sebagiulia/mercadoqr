
import express, { json, urlencoded } from 'express'
import { errorHandler } from './errors/errorHandler'
import { connectDB, sequelize } from "./config/database";



import PlaceController from './controllers/PlaceController'
import PlaceServiceJSON from './services/imp/PlaceServiceJSON'
import PlaceRepositorySequelize from './repositories/imp/placeRepositorySequelize';
const placeRepository = new PlaceRepositorySequelize ()
const placeService = new PlaceServiceJSON(placeRepository)
const placeController = new PlaceController(placeService)

import QrRepositorySequelize from './repositories/imp/qrRepositorySequelize'
const qrRepository = new QrRepositorySequelize()
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
import MercadoPagoRepositorySequelize from './repositories/imp/mercadoPagoRepositorySequelize';
const mercadoPagoRepository = new MercadoPagoRepositorySequelize()
const mercadoPagoService = new MercadoPagoServiceDefault(placeRepository, mercadoPagoRepository, notifierService, qrService)
const mercadoPagoController = new MercadoPagoController(mercadoPagoService, placeService)

import cors from 'cors'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 8080


app.use(cors())
app.use(json());
app.use(urlencoded({ extended: true }));

// GET
app.get('/test', (req, res) => {
    res.json('Hello World!')
} )
app.get('/api/place/:place', placeController.getPlace)
app.get('/api/places/:place', placeController.getPlaces)
app.get('/api/product/:place/:product', placeController.getProduct)
app.get('/api/products/:id/:category', placeController.getProducts)
app.get('/api/categories/:place', placeController.getCategories)
app.get('/api/qrid/:qr', qrController.getQrById)
app.get('/api/scann/consume/:id', scannController.consumeQrByQrId)
app.get('/api/scann/getprod/:id', scannController.getProdByQrId)

// Scann
app.post('/api/scann/validate', scannController.validateScanner)
app.post('/api/scann/consume', scannController.consumeQrByQrCode)
app.post('/api/scann/getscann', scannController.getProdByQrCode)

// MercadoPago
app.post('/api/mp/getInitPoint', mercadoPagoController.getInitPoint)
app.post('/api/mp/notify/:payment_id', mercadoPagoController.processMPNotification)

// Middleware de errores
app.use(errorHandler);


//import DBtest from './test/dbtest'
connectDB()
sequelize.sync().then(() => {
    console.log("✅ Modelos sincronizados"); 
    });


app.listen(port, () => {
    console.log(`Servidor mercadoqr levantado en puerto ${port}`)
})