
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    console.log("Index page is redirecting to dashboard");
  }, []);

  return <Navigate to="/dashboard" replace />;
};

export default Index;
