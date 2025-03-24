"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const errorHandler_1 = require("./errors/errorHandler");
const qrRepositoryJSON_1 = __importDefault(require("./repositories/imp/qrRepositoryJSON"));
const qrRepository = new qrRepositoryJSON_1.default();
const PlaceController_1 = __importDefault(require("./controllers/PlaceController"));
const PlaceServiceJSON_1 = __importDefault(require("./services/imp/PlaceServiceJSON"));
const placeRepositoryJSON_1 = __importDefault(require("./repositories/imp/placeRepositoryJSON"));
const placeRepository = new placeRepositoryJSON_1.default();
const placeService = new PlaceServiceJSON_1.default(placeRepository);
const placeController = new PlaceController_1.default(placeService);
const ScannController_1 = __importDefault(require("./controllers/ScannController"));
const ScannServiceJSON_1 = __importDefault(require("./services/imp/ScannServiceJSON"));
const scannRepositoryJSON_1 = __importDefault(require("./repositories/imp/scannRepositoryJSON"));
const scannRepository = new scannRepositoryJSON_1.default();
const scannService = new ScannServiceJSON_1.default(qrRepository, placeRepository, scannRepository);
const scannController = new ScannController_1.default(scannService);
const NotifierDefault_1 = __importDefault(require("./services/imp/NotifierDefault"));
const notifierService = new NotifierDefault_1.default();
const QrController_1 = __importDefault(require("./controllers/QrController"));
const QrServiceApi_1 = __importDefault(require("./services/imp/QrServiceApi"));
const qrService = new QrServiceApi_1.default(qrRepository, placeRepository);
const qrController = new QrController_1.default(qrService);
const MercadoPagoController_1 = __importDefault(require("./controllers/MercadoPagoController"));
const MercadoPagoServiceDefault_1 = __importDefault(require("./services/imp/MercadoPagoServiceDefault"));
const mercadoPagoRepositoryJSON_1 = __importDefault(require("./repositories/imp/mercadoPagoRepositoryJSON"));
const mercadoPagoRepository = new mercadoPagoRepositoryJSON_1.default();
const mercadoPagoService = new MercadoPagoServiceDefault_1.default(placeRepository, mercadoPagoRepository, notifierService, qrService);
const mercadoPagoController = new MercadoPagoController_1.default(mercadoPagoService, placeService);
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
// GET
app.get('/test', (req, res) => {
    res.json('Hello World!');
});
app.get('/api/place/:place', placeController.getPlace);
app.get('/api/places/:place', placeController.getPlaces);
app.get('/api/product/:place/:product', placeController.getProduct);
app.get('/api/products/:id/:category', placeController.getProducts);
app.get('/api/categories/:place', placeController.getCategories);
app.get('/api/qrid/:qr', qrController.getQrById);
app.get('/api/scann/consume/:id', scannController.consumeQrByQrId);
app.get('/api/scann/getprod/:id', scannController.getProdByQrId);
// Scann
app.post('/api/scann/validate', scannController.validateScanner);
app.post('/api/scann/consume', scannController.consumeQrByQrCode);
app.post('/api/scann/getscann', scannController.getProdByQrCode);
// MercadoPago
app.post('/api/mp/getInitPoint', mercadoPagoController.getInitPoint);
app.post('/api/mp/notify/:payment_id', mercadoPagoController.processMPNotification);
// Middleware de errores
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`Servidor mercadoqr levantado en puerto ${port}`);
});
