import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GUEST_KEY = "open_as_guest";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // If user is guest, clear guest flag and redirect to /auth
    if (localStorage.getItem(GUEST_KEY) === "true") {
      localStorage.removeItem(GUEST_KEY);
      navigate("/auth", { replace: true });
      return;
    }
    // Otherwise, sign out regular user
    await supabase.auth.signOut();
    // Supabase will trigger onAuthStateChange and redirect
  };

  return (
    <Button onClick={handleLogout} size="sm" variant="outline" className="flex gap-2 ml-2">
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};

export default LogoutButton;
