import { useEffect, useState, createContext, useContext } from "react";
import PropTypes from 'prop-types';
import { gapi } from 'gapi-script'; // Google API client

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar o cliente Google API no useEffect
  useEffect(() => {
    const initializeGoogleAPI = () => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: 'SUA_API_KEY_AQUI', 
          clientId: 'SEU_CLIENT_ID_AQUI', 
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
          ],
          scope: 'https://www.googleapis.com/auth/calendar.events',
        }).then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsAuthenticated(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsAuthenticated);
        });
      });
    };

    initializeGoogleAPI();
  }, []);

  // Login no Google
  const login = async () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }
  };

  // Logout do Google
  const logout = async () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      await authInstance.signOut();
    }
  };

  // Adicionar um evento ao calendário
  const addEvent = async (event) => {
    if (!isAuthenticated) {
      await login();
    }

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event, 
      });
      return response.result;
    } catch (error) {
      console.error('Erro ao adicionar evento ao calendário', error);
      throw error;
    }
  };

  return (
    <CalendarContext.Provider value={{ isAuthenticated, login, logout, addEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

CalendarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCalendar = () => {
  return useContext(CalendarContext);
};

export default CalendarContext;
