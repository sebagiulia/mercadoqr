import { PlaceModel } from '../models/mysql/place.js';
import { validatePlace } from '../schemmas/place.js';



export class PlaceController {
    static matchPlace = async (req, res) => {
        const place_name = req.params.place_name

        const place = await PlaceModel.matchPlace({ name: place_name });
        delete place.user_id;

        return res.json(place)
    }

    static findPlaces = async (req, res) => {
        const name = req.params.place_name;
        const places = await PlaceModel.findPlaces({ name })

        return res.json(places)

    }

    static getPlaceDataByPlaceName = async (req, res) => {

        const place_data = await PlaceModel.getPlaceDataByPlaceName({ name: req.params.place_name});

        return res.json(place_data)
    }

    static getQrListFromUserId = async (req, res) => {
        const { place_id, user_id } = req.body;
        const qr_list = await PlaceModel.getQrListFromUserId({place_id, user_id});
        return res.json(qr_list);
    }

    static subscribeToPlace = async (req, res) => {
        const { place_id, user_id } = req.body;
        const result = await PlaceModel.subscribeToPlace({ place_id, user_id });
        if(result.success)
            console.log(user_id + ' se a subscripto a ' + place_id)
        return res.json(result);
    }

    static unsubscribeToPlace = async (req, res) => {
        const { place_id, user_id } = req.body;
        const result = await PlaceModel.unsubscribeToPlace({ place_id, user_id });
        if(result.success)
            console.log(user_id + ' se a desubscripto de ' + place_id)
        return res.json(result);
    }

    static buyqr = async (req, res) => {
        const { place_id, user_id, product_id, quantity } = req.body;
        const result = await PlaceModel.buyqr({ place_id, user_id, product_id, quantity });
        return res.json(result);
    }

    static getqrs = async (req, res) => {
        const { user_id } = req.body
        const result = await PlaceModel.getqrs({ user_id })
        return res.json(result);
    }

    static getsubs = async (req, res) => {
        const { user_id } = req.body
        const result = await PlaceModel.getsubs({ user_id })
        return res.json(result);
    }

    static getplaces = async (req, res) => {
        const { user_id } = req.body
        const result = await PlaceModel.getplaces({ user_id })
        return res.json(result);
    }

    static createPlace = async (req, res) => {
        
        /* Separamos los difentes datos */
        const file = req.file;
        const data = {...req.body}
        const user_id = data.user_id;
        const placeData = req.body;
        delete placeData.user_id

        const img = "http://mercadoqr-server.onrender.com/profile-images/" + file.filename;

        const result = validatePlace({img, ...placeData});

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const place = await PlaceModel.createPlace(result.data, user_id);
        if(place.success) {
            console.log("Place created [" + placeData.name  + "] by " + user_id);
        }
        return res.json(place);
    }
}