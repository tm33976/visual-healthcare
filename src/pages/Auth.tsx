
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";

type AuthMode = "login" | "signup";

const GUEST_KEY = "open_as_guest";

const Auth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [emailVerificationMsg, setEmailVerificationMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, or guest session is present, redirect to home
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user || localStorage.getItem(GUEST_KEY) === "true") {
        navigate("/", { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setEmailVerificationMsg(null);

    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message || "Login failed");
      } else {
        // Clear guest session if logging in
        localStorage.removeItem(GUEST_KEY);
        navigate("/", { replace: true });
      }
      setLoading(false);
      return;
    }

    // SIGNUP MODE
    if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(username)) {
      setErrorMsg("Username must be 3-20 chars, letters/numbers/._- only");
      setLoading(false);
      return;
    }

    // Try to sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (signUpError) {
      setErrorMsg(signUpError.message || "Signup failed");
      setLoading(false);
      return;
    }

    // If session is not immediately available, Supabase likely requires email verification
    if (!data.session) {
      setEmailVerificationMsg(
        "Signup successful! Please check your email inbox and verify your address before logging in."
      );
      setLoading(false);
      return;
    }

    // Insert the username into the profiles table as the logged-in user
    const sessionUserId = data.session.user.id;
    const { error: profileError } = await supabase.from("profiles").insert([
      { id: sessionUserId, username },
    ]);
    if (profileError) {
      if (
        profileError.code === "23505" ||
        (profileError.message && profileError.message.toLowerCase().includes("duplicate"))
      ) {
        setErrorMsg("That username is taken.");
      } else {
        setErrorMsg(profileError.message || "Could not create profile.");
      }
      setLoading(false);
      return;
    }

    // Clear guest session if logging in/up
    localStorage.removeItem(GUEST_KEY);
    navigate("/", { replace: true });
    setLoading(false);
  };

  const handleGuest = () => {
    // Set guest profile in localStorage
    localStorage.setItem(GUEST_KEY, "true");
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        username: "Guest",
        firstName: "Guest",
        lastName: "",
        email: "",
        phone: "",
        profileImage: "",
      })
    );
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[325px] space-y-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2 text-center">
          {authMode === "login" ? "Login" : "Sign Up"}
        </h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {authMode === "signup" && (
            <div>
              <Input
                placeholder="Username"
                type="text"
                required
                maxLength={20}
                minLength={3}
                pattern="^[a-zA-Z0-9_.-]{3,20}$"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
          )}
          <div>
            <Input
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Input
              placeholder="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {authMode === "login" && (
              <div className="flex justify-end mt-1">
                <ForgotPasswordDialog />
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? authMode === "login"
                ? "Logging in..."
                : "Signing up..."
              : authMode === "login"
              ? "Login"
              : "Sign Up"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={handleGuest}
            disabled={loading}
          >
            Open as Guest
          </Button>
          {errorMsg && <div className="text-red-500 text-[13px] mt-2 text-center">{errorMsg}</div>}
          {successMsg && <div className="text-green-500 text-[13px] mt-2 text-center">{successMsg}</div>}
          {emailVerificationMsg && (
            <div className="text-blue-600 text-[13px] mt-2 text-center">{emailVerificationMsg}</div>
          )}
        </form>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm text-gray-500">
            {authMode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <Button
            variant="link"
            type="button"
            className="text-blue-600 text-xs"
            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
            disabled={loading}
          >
            {authMode === "login" ? "Sign up" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
