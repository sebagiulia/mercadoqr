const dn = 'http://localhost:1024/api';

const endpoints = {
    server: 'http://localhost:1024',
    places: {
      getPlace: (place: string) => dn + `/place/${place}`,
      getPlaces: (place: string) => dn + `/places/${place}`,
      getProduct: (place: string, prod: string) => dn + `/product/${place}/${prod}`,
      getProducts: (placeid: number) => dn + `/products/${placeid}`,
    },
    payment: {
      processPayment: dn + '/payment'
    },
    qr: {
      qrByCode: (code: string) => dn + `/qrcode/${code}`,
      qrById: (id: string) => dn + `/qrid/${id}`
    },
    scann: {
        validate : dn + '/scann/validate'
    }
  };
  
  export default endpoints;
  