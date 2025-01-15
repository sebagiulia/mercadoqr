
import express, { json, urlencoded } from 'express'

import { errorHandler } from './errors/errorHandler'

import PaymentController from './controllers/PaymentController'
import PaymentServiceJSON from './services/imp/PaymentServiceJSON'
const paymentService = new PaymentServiceJSON()
paymentService.initialize({})
const paymentController = new PaymentController(paymentService)

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
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// POST
app.post('/api/payment', paymentController.processPayment)

// Middleware de errores
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})