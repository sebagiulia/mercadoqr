const EXTERNAL_API = 'http://192.168.0.100:8080';

const ROUTER = {
    CONSUME: '/api/scann/consume/',
    GET_QR_DATA: '/api/scann/getprod/',
    VALIDATE: 'api/scann/validate',
};

export default {
    CONSUME_API: EXTERNAL_API + ROUTER.CONSUME,
    GET_QR_DATA_API: EXTERNAL_API + ROUTER.GET_QR_DATA,
    VALIDATE_API: EXTERNAL_API + ROUTER.VALIDATE
}
