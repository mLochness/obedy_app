import { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //const [isToken, setIsToken] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("loginStorage") || "");
  const [isPending, setIsPending] = useState(true); 
  const [userRole, setUserRole] = useState(null);
  const [userID, setUserID] = useState(null);
  const redirect = useNavigate();
  
 
  useEffect(() => {
    const loginObj = localStorage.getItem("loginStorage");

    if (loginObj) {
      const loginObjParsed = JSON.parse(loginObj);
      const storedToken = loginObjParsed.accessToken;
      const uRole = loginObjParsed.userRole;
      const uID = loginObjParsed.userID;
      //const userName = loginObjParsed.userName;
      setToken(storedToken);
      setIsPending(false);
      setUserRole(uRole);
      setUserID(uID)
      //console.log('AuthContext useEffect, token:', token );
      if (uRole === "user") {
        console.log("Auth - user role?:", uRole);
        redirect('/udashboard');
      }
      else if (uRole === "admin") {
        console.log("Auth - user role?:", uRole);
        redirect('/adashboard');
      }
      else {
        setUserRole(null);
        redirect('/login');
        console.log("AuthLogout - userRole:", userRole)
      }
    } 

  }, [token]);

  console.log('AuthContext run');


  const contextValue = useMemo (
    () => ({
      token,
      setToken,
      userRole,
      setUserRole,
      userID,
      setUserID,
      isPending,
      setIsPending
    }),
    [token, isPending, userRole, userID]
  );


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};