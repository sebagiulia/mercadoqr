"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Token requerido" });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, payload) => {
        if (err)
            return res.status(403).json({ message: "Token inválido" });
        req.placeId = payload.placeId;
        next();
    });
}
