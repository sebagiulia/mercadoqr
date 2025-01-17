
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
const placeService = new PlaceServiceJSON()
const placeController = new PlaceController(placeService)

import cors from 'cors'

const app = express()
const port = 1024

app.use(cors())
app.use(json());
app.use(urlencoded({ extended: true }));

// GET
app.get('/api/place/:place', placeController.getPlace)
app.get('/api/places/:place', placeController.getPlaces)
app.get('/api/product/:place/:product', placeController.getProduct)
app.get('/api/qrid/:qr', qrController.getQrById)
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// POST
app.post('/api/payment', paymentController.processPayment)

// Middleware de errores
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor mercadoqr levantado en puerto ${port}`)
})