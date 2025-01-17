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
const PaymentController_1 = __importDefault(require("./controllers/PaymentController"));
const PaymentServiceDefault_1 = __importDefault(require("./services/imp/PaymentServiceDefault"));
const qrRepository = new qrRepositoryJSON_1.default();
const paymentService = new PaymentServiceDefault_1.default(qrRepository);
paymentService.initialize({});
const paymentController = new PaymentController_1.default(paymentService);
const QrController_1 = __importDefault(require("./controllers/QrController"));
const QrServiceApi_1 = __importDefault(require("./services/imp/QrServiceApi"));
const qrService = new QrServiceApi_1.default(qrRepository);
const qrController = new QrController_1.default(qrService);
const PlaceController_1 = __importDefault(require("./controllers/PlaceController"));
const PlaceServiceJSON_1 = __importDefault(require("./services/imp/PlaceServiceJSON"));
const placeService = new PlaceServiceJSON_1.default();
const placeController = new PlaceController_1.default(placeService);
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 1024;
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
// GET
app.get('/api/place/:place', placeController.getPlace);
app.get('/api/places/:place', placeController.getPlaces);
app.get('/api/product/:place/:product', placeController.getProduct);
app.get('/api/qrid/:qr', qrController.getQrById);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// POST
app.post('/api/payment', paymentController.processPayment);
// Middleware de errores
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`Servidor mercadoqr levantado en puerto ${port}`);
});
