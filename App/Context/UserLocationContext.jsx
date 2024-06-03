import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const UserLocationContext = createContext(null);

export const UserLocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    };

    getLocation();
  }, []);

  return (
    <UserLocationContext.Provider value={{ location, setLocation, errorMsg }}>
      {children}
    </UserLocationContext.Provider>
  );
};
