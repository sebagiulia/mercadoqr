const server = 'http://192.168.0.100:1025';
const dn = server + '/api';


const endpoints = {
    server: 'http://192.168.0.100:1025',
    places: {
      getPlace: (place: string) => dn + `/place/${place}`,
      getPlaces: (place: string) => dn + `/places/${place}`,
      getProduct: (place: string, prod: string) => dn + `/product/${place}/${prod}`,
      getProducts: (placeid: number, category:string) => dn + `/products/${placeid}/${category}`,
      getCategories: (place:string) => dn + '/categories/' + place,
    },
    payment: {
      processPayment: dn + '/payment'
    },
    qr: {
      qrByCode: (code: string) => dn + `/qrcode/${code}`,
      qrById: (id: string) => dn + `/qrid/${id}`
    },
    scann: {
        validate : dn + '/scann/validate',
        getScann : dn + '/scann/getScann',
        consume: dn + '/scann/consume'
    },
    mp:{
      getInitPoint: dn + '/mp/getInitPoint'
    }
  };
  
  export default endpoints;
  