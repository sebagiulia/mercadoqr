const EXTERNAL_API = 'http://192.168.0.100:8080';

const ROUTER = {
    GET_PLACE_DATA: '/api/admin/place/',
    UPDATE_PLACE_DATA: '/api/admin/place/update/',
    GET_PLACE_PRODUCTS: '/api/admin/products/' /* place_id / category_id["Todo"] */,
    CREATE_PRODUCT: '/api/admin/product/create',
    UPDATE_PRODUCT: '/api/admin/product/update',
    DELETE_PRODUCT: '/api/admin/product/delete',
    LOGIN: '/api/admin/login',
    LOGOUT: '/api/admin/logout',
    GET_PLACE_MOVEMENTS: '/api/admin/movements' /* place_id */,
};

export default {
    GET_PLACE_DATA_API: EXTERNAL_API + ROUTER.GET_PLACE_DATA,
    UPDATE_PLACE_DATA_API: EXTERNAL_API + ROUTER.UPDATE_PLACE_DATA,
    GET_PLACE_PRODUCTS_API: EXTERNAL_API + ROUTER.GET_PLACE_PRODUCTS,
    CREATE_PRODUCT_API: EXTERNAL_API + ROUTER.CREATE_PRODUCT,
    UPDATE_PRODUCT_API: EXTERNAL_API + ROUTER.UPDATE_PRODUCT,
    DELETE_PRODUCT_API: EXTERNAL_API + ROUTER.DELETE_PRODUCT,
    LOGIN_API: EXTERNAL_API + ROUTER.LOGIN,
    LOGOUT_API: EXTERNAL_API + ROUTER.LOGOUT,
    GET_PLACE_MOVEMENTS_API: EXTERNAL_API + ROUTER.GET_PLACE_MOVEMENTS,
}
