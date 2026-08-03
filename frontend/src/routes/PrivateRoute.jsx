import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, roles }) {

  const { user } = useContext(AuthContext);


  // Pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  // Vérification des rôles
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }


  return children;
}