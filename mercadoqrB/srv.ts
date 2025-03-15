
import express, { json, urlencoded } from 'express'

import { errorHandler } from './errors/errorHandler'


import QrRepositoryJSON from './repositories/imp/qrRepositoryJSON'
import PaymentController from './controllers/PaymentController'
import PaymentServiceDefault from './services/imp/PaymentServiceDefault'
const qrRepository = new QrRepositoryJSON()
const paymentService = new PaymentServiceDefault(qrRepository)
paymentService.initialize({})
const paymentController = new PaymentController(paymentService)

import QrController from './controllers/QrController'
import QrServiceImp from './services/imp/QrServiceApi'
const qrService = new QrServiceImp(qrRepository)
const qrController = new QrController(qrService)

import PlaceController from './controllers/PlaceController'
import PlaceServiceJSON from './services/imp/PlaceServiceJSON'
import PlaceRepositoryJSON from './repositories/imp/placeRepositoryJSON'
const placeRepository = new PlaceRepositoryJSON()
const placeService = new PlaceServiceJSON(placeRepository)
const placeController = new PlaceController(placeService)

import ScannController from './controllers/ScannController'
import ScannServiceJSON from './services/imp/ScannServiceJSON'
import ScannRepositoryJSON from './repositories/imp/scannRepositoryJSON'
const scannRepository = new ScannRepositoryJSON()
const scannService = new ScannServiceJSON(qrRepository, placeRepository, scannRepository)
const scannController = new ScannController(scannService)


import MercadoPagoController from './controllers/MercadoPagoController'
import MercadoPagoServiceDefault from './services/imp/MercadoPagoServiceDefault'
const mercadoPagoService = new MercadoPagoServiceDefault(placeRepository)
const mercadoPagoController = new MercadoPagoController(mercadoPagoService)

import cors from 'cors'

const app = express()
const port = 1025

app.use(cors())
app.use(json());
app.use(urlencoded({ extended: true }));

// GET
app.get('/api/place/:place', placeController.getPlace)
app.get('/api/places/:place', placeController.getPlaces)
app.get('/api/product/:place/:product', placeController.getProduct)
app.get('/api/products/:id/:category', placeController.getProducts)
app.get('/api/categories/:place', placeController.getCategories)
app.get('/api/qrid/:qr', qrController.getQrById)
app.get('/api/scann/consume/:id', scannController.consumeQrByQrId)
app.get('/api/scann/getprod/:id', scannController.getProdByQrId)

// POST
//app.post('/api/payment', paymentController.processPayment)
app.post('/api/scann/validate', scannController.validateScanner)
app.post('/api/scann/consume', scannController.consumeQrByQrCode)
app.post('/api/scann/getscann', scannController.getProdByQrCode)

// MercadoPago
app.post('/api/mp/getInitPoint', mercadoPagoController.getInitPoint)
app.post('/api/notification_url', paymentController.processPayment)

// Middleware de errores
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor mercadoqr levantado en puerto ${port}`)
})