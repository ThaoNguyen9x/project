import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../components/share/Context";

const PrivateRoute = (props) => {
  const { user } = useContext(AuthContext);

  if (user && user.id) {
    return <>{props.children}</>;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
