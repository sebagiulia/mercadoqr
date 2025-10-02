const EXTERNAL_API = 'http://192.168.0.100:8080';

const ROUTER = {
    LOGIN: '/api/scann/login',
    CONSUME: '/api/scann/consume',
    GET_QR_DATA: '/api/scann/getprod',
    GET_PLACE_DATA: '/api/scann/place',
    GET_SCANNER_DATA: '/api/scann/scanner',
};

export default {
    LOGIN_API: EXTERNAL_API + ROUTER.LOGIN,
    CONSUME_API: EXTERNAL_API + ROUTER.CONSUME,
    GET_QR_DATA_API: EXTERNAL_API + ROUTER.GET_QR_DATA,
    GET_PLACE_DATA_API: EXTERNAL_API + ROUTER.GET_PLACE_DATA,
    GET_SCANNER_DATA_API: EXTERNAL_API + ROUTER.GET_SCANNER_DATA,
}
