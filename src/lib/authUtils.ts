
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token'); //Though Supabase client handles this, good for explicit cleanup

  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.startsWith('sb-') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });

  // Remove from sessionStorage if in use (though we configured localStorage)
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.startsWith('sb-') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
  console.log("Auth state cleaned from localStorage and sessionStorage");
};
