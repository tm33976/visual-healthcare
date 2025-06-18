
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface UsernameOnboardingDialogProps {
  open: boolean;
  onSubmit: (username: string) => void;
  onClose?: () => void;
}

const UsernameOnboardingDialog: React.FC<UsernameOnboardingDialogProps> = ({
  open,
  onSubmit,
  onClose,
}) => {
  const [username, setUsername] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    // Validate basic username rules on client
    if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(username)) {
      setErr("Username must be 3-20 chars, letters/numbers only");
      setLoading(false);
      return;
    }

    // Insert profile on Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userData?.user?.id) {
      setErr("Could not find logged-in user.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("profiles").insert([
      { id: userData.user.id, username },
    ]);
    if (error) {
      if (error.code === "23505" || (error.message && error.message.includes("duplicate"))) {
        setErr("That username is taken.");
      } else {
        setErr(error.message);
      }
      setLoading(false);
      return;
    }
    setLoading(false);
    onSubmit(username);
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <form onSubmit={handleSave} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Choose a username</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            maxLength={20}
            autoFocus
          />
          {err && <div className="text-red-500 text-xs">{err}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameOnboardingDialog;
