import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Redirect if already authenticated
  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect to cross-domain auth
  React.useEffect(() => {
    if (!loading) {
      const currentUrl = window.location.href;
      const redirectUrl = `https://user.axionhosting.com/auth/login?redirect=${encodeURIComponent(currentUrl)}&app=main`;
      window.location.href = redirectUrl;
    }
  }, [loading]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white">Redirecting to secure authentication...</p>
      </div>
    </div>
  );
};

export default Auth;