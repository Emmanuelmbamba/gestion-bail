import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function AdminRoute({ children }) {

  const { user } = useContext(AuthContext);


  // Pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  // Pas administrateur
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }


  return children;
}


export default AdminRoute;