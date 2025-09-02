import { Place } from "../../domain/entities/Place";
import { IPlaceRepository } from "../../domain/repositories/IPlaceRepository";

let mockPlace = {
    "id": 1,
    "name": "tuevento",
    "address": "Av. Columbres 1756",
    "description": "Tus noches de verano al aire libre",
    "img": "https://static.vecteezy.com/system/resources/previews/010/628/580/non_2x/cocktail-logo-design-template-bar-logo-vector.jpg",
    "credential":"APP_USR-5448777090717317-013117-42fd553b67ae0e11f1b8e7a817f92e08-2242708272"
}

export class MockPlaceRepository implements IPlaceRepository {
    async getPlaceData(place_id: string): Promise<Place> {
        // In a real implementation, you would fetch data based on place_id
        return mockPlace;
    }

    async updatePlaceData(place_id: string, updatedFields: Partial<Place>): Promise<Place> {
        // In a real implementation, you would update the data in a database
        const updatedPlace = { ...mockPlace, ...updatedFields };
        mockPlace = updatedPlace; // Update the mock data
        return updatedPlace;
    }
}