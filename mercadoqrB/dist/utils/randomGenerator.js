"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateUniqueCode;
function generateUniqueCode(existingCodes) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const codeLength = 6;
    function generateRandomCode() {
        let code = "";
        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            code += charset[randomIndex];
        }
        return code;
    }
    let newCode;
    do {
        newCode = generateRandomCode();
    } while (existingCodes.includes(newCode));
    return newCode;
}
