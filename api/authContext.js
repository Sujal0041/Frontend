import React, {createContext, useContext, useState, useEffect} from 'react';
import base64 from 'base-64';
import {getCurrency, logout} from './api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userToken, setUserToken] = useState(null);
  const [currency, setCurrency] = useState([]);

  useEffect(() => {
    const isTokenExpired = () => {
      if (!userToken) return true;
      const tokenExpiration = decodeToken(userToken).exp;
      console.log('Token expiration:', new Date(tokenExpiration * 1000));
      return Date.now() >= tokenExpiration * 1000;
    };

    if (isTokenExpired()) {
      signOut();
    }
    const tokenExpirationCheckInterval = setInterval(() => {
      if (isTokenExpired()) {
        signOut();
      }
    }, 15 * 60 * 1000); // Check token expiration every 15 minutes

    return () => clearInterval(tokenExpirationCheckInterval);
  }, [userToken]);

  const decodeToken = token => {
    const payload = token.split('.')[1];
    return JSON.parse(base64.decode(payload));
  };

  const signIn = async token => {
    setUserToken(token);
    fetchCurrencyCodes();

    console.log('Sign in Token:', token);
  };

  const fetchCurrencyCodes = async () => {
    try {
      const response = await getCurrency();
      console.log(response);
      setCurrency(response);
    } catch (error) {
      console.error('Error fetching currency:', error);
    }
  };

  const signOut = () => {
    setUserToken(null);
    logout();
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{userToken, currency, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
