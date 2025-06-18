import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import UsernameOnboardingDialog from "./UsernameOnboardingDialog";

const GUEST_KEY = "open_as_guest";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If guest, allow access and no further checks are needed
    if (localStorage.getItem(GUEST_KEY) === "true") {
      setAuthenticated(true);
      setLoading(false);
      setShowUsernameDialog(false); // Never show username dialog for guests
      setProfileChecked(true);
      return;
    }

    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session?.user);
      setLoading(false);

      if (!session?.user) {
        navigate("/auth", { replace: true });
      } else {
        checkProfile(session.user.id);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session?.user);
      setLoading(false);

      if (!session?.user) {
        navigate("/auth", { replace: true });
      } else {
        checkProfile(session.user.id);
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
    // eslint-disable-next-line
  }, [navigate]);

  // Check if profile exists for current user
  async function checkProfile(userId: string) {
    setProfileChecked(false);
    const { data, error } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (!error && data && data.id) {
      setHasProfile(true);
    } else {
      setHasProfile(false);
      setShowUsernameDialog(true);
    }
    setProfileChecked(true);
  }

  // When dialog submits username, refresh state
  function handleOnboarded() {
    setHasProfile(true);
    setShowUsernameDialog(false);
  }

  if (loading || !profileChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
      </div>
    );
  }

  if (!authenticated) {
    return null; // Redirecting
  }

  // Do NOT show username dialog for guest sessions
  if (localStorage.getItem(GUEST_KEY) === "true") {
    return <>{children}</>;
  }

  // If authenticated but missing username
  if (!hasProfile) {
    return (
      <UsernameOnboardingDialog
        open={showUsernameDialog}
        onSubmit={handleOnboarded}
      />
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
