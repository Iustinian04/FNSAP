
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const AuthPage = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Optional: Add any specific logic for when the auth page loads
    // e.g., clear specific non-auth related local storage if needed
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading authentication status...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
