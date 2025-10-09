import { useCreate } from "@/hooks/useCreate";
import CreateScreen from "@/screens/CreateScreen";
import { useNavigate } from "react-router-dom";

const CreateScreenWrapper: React.FC = () => {
    const navigate = useNavigate();
  
    const { createPlace, error } = useCreate()  // Simulación de props
  
    return <CreateScreen error={error}
                         createPlace={createPlace}
                         onBack={() => navigate("/")} />;
  };

export default CreateScreenWrapper;