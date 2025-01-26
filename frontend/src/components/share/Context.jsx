import { createContext, useState } from "react";

export const AuthContext = createContext({
  id: "",
  name: "",
  email: "",
  mobile: "",
  role: "",
  isOnline: ""
});

export const AuthWrapper = (props) => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
    role: "",
    isOnline: ""
  });

  const [isAppLoading, setIsAppLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAppLoading, setIsAppLoading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
