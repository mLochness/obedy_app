import { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("loginStorage") || "");
  // const [token, setToken] = useState(sessionStorage.getItem("loginStorage") || "");
  const [isPending, setIsPending] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userID, setUserID] = useState(null);
  const redirect = useNavigate();


  useEffect(() => {
    const loginObj = localStorage.getItem("loginStorage");

    if (!loginObj) return;
    const { accessToken, userRole: uRole, userID: uID } = JSON.parse(loginObj);

    setToken(accessToken);
    setIsPending(false);
    setUserRole(uRole);
    setUserID(uID);

    switch (uRole) {
      case "user":
        redirect("/udashboard");
        break;
      case "admin":
        redirect("/adashboard");
        break;
      default:
        setUserRole(null);
        redirect("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);



  const contextValue = useMemo(
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