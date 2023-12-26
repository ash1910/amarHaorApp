import React, { useState, useEffect } from "react";
import { isLoggedIn, getCurrentUser, getFiles } from "../functions/auth";

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [CurrentUser, setCurrentUser] = useState({});
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [Token, setToken] = useState(null); 

  const isLoggedInUpdate = async () => {
    if(await isLoggedIn()){
      setIsLoggedIn(true);
      let currentUser = await getCurrentUser();
      setCurrentUser(currentUser);
      setToken(currentUser.token || null);
    }
  }

  useEffect( () => {
    isLoggedInUpdate()
  }, []);

  return (
    <AuthContext.Provider
      value={{
        CurrentUser: CurrentUser,
        setCurrentUser: setCurrentUser,
        IsLoggedIn: IsLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        Token: Token,
        setToken: setToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
