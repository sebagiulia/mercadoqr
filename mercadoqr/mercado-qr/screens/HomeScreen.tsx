import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import { SearchIcon } from "../components/Icons";
import { PlaceCardSkeleton } from "../components/Skeletons";
import Place from "../models/place";

interface HomeScreenProps {
  loading: boolean;
  places: Place[];
  onSelectPlace: (placeName: string) => void;
}

const PlaceCard: React.FC<{ place: Place; onSelect: () => void }> = ({
  place,
  onSelect,
}) => (
  <div
    className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
    onClick={onSelect}
  >
    <img
      src={place.img}
      alt={place.name}
      className="w-full h-32 object-cover"
    />
    <div className="p-4">
      <h3 className="font-bold text-lg text-mercado-gray">{place.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{place.address}</p>
    </div>
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ loading, places, onSelectPlace }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlaces = useMemo(() => {
    if (!searchTerm) return places;
    return places.filter((place) =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, places]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Mercado QR" />
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar negocios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-mercado-blue"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
      </div>
      <main className="flex-grow p-4 pt-0">
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <PlaceCardSkeleton key={index} />
            ))
          ) : filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onSelect={() => onSelectPlace(place.name)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">
              No se encontraron negocios.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
