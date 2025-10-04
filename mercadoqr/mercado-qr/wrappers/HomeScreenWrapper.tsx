import React from "react";
import { useNavigate } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";
import { usePlaces } from "../hooks/usePlaces";

const HomeScreenWrapper: React.FC = () => {
  const navigate = useNavigate();

  const { places, loading } = usePlaces();


  const handleSelectPlace = (placeName: string) => {
    navigate(`/${placeName}`);
  };


  return <HomeScreen 
            loading={loading}
            places={places}
            onSelectPlace={handleSelectPlace} />;
};

export default HomeScreenWrapper;
