
const server = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:8080';
const dn = server + '/api';


const endpoints = {
    server,
    places: {
      getPlace: (place: string) => dn + `/place/${place}`,
      getPlaces: (place: string) => dn + `/places/${place}`,
      getProduct: (place: string, prod: string) => dn + `/product/${place}/${prod}`,
      getProducts: (placeid: number, category:string) => dn + `/products/${placeid}/${category}`,
      getCategories: (place:string) => dn + '/categories/' + place,
      create: dn + '/place/create',
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
  