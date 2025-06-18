
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth` // redirect after reset
    });

    if (error) {
      setMessage(error.message || "Error sending reset email");
      setSent(false);
    } else {
      setMessage("Password reset email sent! Please check your inbox.");
      setSent(true);
    }
    setLoading(false);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setEmail("");
      setSent(false);
      setLoading(false);
      setMessage(null);
    }
    setOpen(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-blue-600 hover:underline bg-transparent p-0 border-0 ml-auto block">
          Forgot Password?
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address to receive a reset password link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReset} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading || sent}
            autoFocus
          />
          <DialogFooter>
            <Button type="submit" disabled={loading || sent}>
              {loading ? "Sending..." : sent ? "Sent!" : "Send Reset Email"}
            </Button>
          </DialogFooter>
        </form>
        {message && <div className={`${sent ? "text-green-600" : "text-red-500"} text-xs text-center mt-2`}>{message}</div>}
      </DialogContent>
    </Dialog>
  );
}
