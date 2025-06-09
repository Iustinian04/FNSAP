
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/lib/authUtils';
// import { useNavigate } from 'react-router-dom'; // useNavigate is not used here, can be removed if not needed elsewhere in this file.

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate(); // Not used in the current logic of AuthProvider other than signOut

  useEffect(() => {
    setLoading(true);
    console.log('[AuthProvider] useEffect started. Supabase client initialized:', !!supabase);
    console.log('[AuthProvider] supabase.auth available:', !!supabase?.auth);
    console.log('[AuthProvider] supabase.auth.getSession type:', typeof supabase?.auth?.getSession);

    // Check if supabase.auth and supabase.auth.getSession are available
    if (supabase && supabase.auth && typeof supabase.auth.getSession === 'function') {
      const sessionPromise = supabase.auth.getSession();
      console.log('[AuthProvider] sessionPromise from getSession():', sessionPromise);

      if (sessionPromise && typeof sessionPromise.then === 'function') {
        sessionPromise.then(({ data: { session: currentSession } }) => {
          console.log('[AuthProvider] getSession success. Session:', currentSession);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }).catch((error) => {
          console.error('[AuthProvider] Error in getSession promise:', error);
          setSession(null); // Clear session on error
          setUser(null);    // Clear user on error
          setLoading(false);
        });
      } else {
        console.error('[AuthProvider] supabase.auth.getSession() did not return a thenable object. Value:', sessionPromise);
        setSession(null);
        setUser(null);
        setLoading(false); // Critical: ensure loading is set to false
      }
    } else {
      console.error('[AuthProvider] supabase.auth.getSession is not available or not a function.');
      setSession(null);
      setUser(null);
      setLoading(false); // Critical: ensure loading is set to false
    }

    // onAuthStateChange listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('[AuthProvider] onAuthStateChange event:', _event, 'session:', newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false); // Ensure loading is false after auth state change
      }
    );

    return () => {
      console.log('[AuthProvider] useEffect cleanup. Unsubscribing from auth changes.');
      authListener?.subscription?.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  const signOut = async () => {
    setLoading(true);
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error('Error during global sign out:', error);
      await supabase.auth.signOut(); // Fallback to local sign out
    } finally {
      setSession(null);
      setUser(null);
      setLoading(false);
      // navigate('/auth', { replace: true }); // Replaced by window.location.href for full refresh
      window.location.href = '/auth';
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

