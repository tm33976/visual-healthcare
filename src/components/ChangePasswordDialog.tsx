
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ChangePasswordDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Note: Supabase does not require current password for update, but you can add it for extra user assurance/UI.
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast({ title: "Error", description: "New password cannot be empty", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setLoading(true);
    // Supabase uses updateUser({ password: ... })
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Success", description: "Password changed successfully." });
    setLoading(false);
    setOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter and confirm your new password. Minimum 6 characters.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Optionally, require current password field to build trust. Not required for actual supabase update */}
          {/* <div>
            <label className="text-xs font-medium">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
            />
          </div> */}
          <div>
            <label className="text-xs font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" type="button" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
