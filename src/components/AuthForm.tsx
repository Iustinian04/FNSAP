
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/lib/authUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ChartBarIcon } from '@/components/icons/ChartBarIcon';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sterge orice pre-existente in starea de autentificare
    cleanupAuthState();
    try {
      // Incercare de deconectare globala inainte de autentificare
      await supabase.auth.signOut({ scope: 'global' });
    } catch (signOutError) {
      console.warn("Pre-auth global sign out attempt failed, proceeding:", signOutError);
      
    }

    try {
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({ email, password });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      if (response.error) {
        throw response.error;
      }

      if (isSignUp && response.data.user) {
        toast({
          title: 'Signup Successful!',
          description: 'Please check your email to confirm your account.',
        });
        // User-ul este creat, dar poate necesita confirmare prin email.
        // Nu redirectionam imediat, lasam utilizatorul sa confirme emailul.
      } else if (!isSignUp && response.data.session) {
         toast({
          title: 'Login Successful!',
          description: 'Redirecting to dashboard...',
        });
        // Autentificarea a reusit, redirectionam utilizatorul
        // catre dashboard sau pagina principala.
        window.location.href = '/';
      } else if (isSignUp && !response.data.user && !response.data.session) {
        // In cazul in care utilizatorul nu este creat, dar nu exista eroare,
        // probabil ca este necesara confirmarea emailului.
         toast({
          title: 'Signup Initiated',
          description: 'Please check your email to confirm your account.',
        });
      }

    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: 'Authentication Failed',
        description: err.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card shadow-xl rounded-lg border">
      <div className="flex flex-col items-center space-y-2">
        <ChartBarIcon className="h-12 w-12 text-primary" />
        <h1 className="text-3xl font-bold text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-muted-foreground text-center">
          {isSignUp ? 'Enter your details to sign up for FinSenti.' : 'Sign in to access your FinSenti dashboard.'}
        </p>
      </div>
      <form onSubmit={handleAuth} className="space-y-6">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="mt-1"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
        </Button>
      </form>
      <p className="text-sm text-center text-muted-foreground">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="font-medium text-primary hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
       <p className="text-xs text-center text-muted-foreground pt-4">
        By signing up, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
};

export default AuthForm;
