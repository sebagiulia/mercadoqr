"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToDashCase = transformToDashCase;
exports.transformToSpaceCase = transformToSpaceCase;
function transformToDashCase(str) {
    return str.toLowerCase().replace(/\s+/g, '-');
}
function transformToSpaceCase(str) {
    return str.replace(/-/g, ' ');
}
