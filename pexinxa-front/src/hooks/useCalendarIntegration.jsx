import { useState } from "react";

const useCalendarIntegrations = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async () => {
    try {
      // Implementar login com Google Auth
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao autenticar:", error);
    }
  };

  const addEvent = async (eventDetails) => {
    try {
    
      console.log("Evento adicionado:", eventDetails);
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    }
  };

  return {
    isAuthenticated,
    login,
    addEvent,
  };
};

export default useCalendarIntegrations;
