import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Image, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DiaryEntry {
  id?: string;
  user_id?: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function DiaryEntryForm({
  entry,
  onClose,
}: {
  entry: DiaryEntry | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(entry?.image_url || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  async function uploadImage(file: File): Promise<string | null> {
    const user = await supabase.auth.getUser();
    const uid = user.data.user?.id;
    if (!uid) {
      toast({ title: "Auth error", description: "You must be logged in" });
      return null;
    }
    const ext = file.name.split('.').pop();
    const path = `${uid}/${crypto.randomUUID()}.${ext || "jpg"}`;
    const { data, error } = await supabase.storage.from("diary_images").upload(path, file, {
      contentType: file.type,
      upsert: true
    });
    if (error) {
      toast({ title: "Upload failed", description: error.message });
      return null;
    }
    return `${supabase.storage.from("diary_images").getPublicUrl(path).data.publicUrl}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imgUrl: string | null = entry?.image_url || null;
    if (file) {
      const uploaded = await uploadImage(file);
      if (!uploaded) {
        setLoading(false);
        return;
      }
      imgUrl = uploaded;
    }

    if (entry) {
      // Update existing entry
      const { error } = await (supabase as any)
        .from("diary_entries")
        .update({
          title,
          content,
          image_url: imgUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", entry.id);
      if (error) {
        toast({ title: "Update failed", description: error.message });
        setLoading(false);
        return;
      }
      toast({ title: "Diary updated" });
    } else {
      // Insert new entry
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if (!uid) {
        toast({ title: "Auth error", description: "You must be logged in" });
        setLoading(false);
        return;
      }
      const { error } = await (supabase as any)
        .from("diary_entries")
        .insert({
          user_id: uid,
          title,
          content,
          image_url: imgUrl,
          updated_at: new Date().toISOString(), // REQUIRED for NOT NULL
        });
      if (error) {
        toast({ title: "Insert failed", description: error.message });
        setLoading(false);
        return;
      }
      toast({ title: "Diary entry created" });
    }
    setLoading(false);
    onClose();
  }

  return (
    <div className="bg-black/50 fixed z-[90] inset-0 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg relative shadow-lg">
        <button
          className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 text-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <X />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {entry ? "Edit Diary Entry" : "New Diary Entry"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              required
              disabled={loading}
              placeholder="e.g., Morning Check-in"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              disabled={loading}
              placeholder="Describe your symptoms, mood, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Image className="w-4 h-4" /> Optional Image
            </label>
            {preview && (
              <img src={preview} alt="Preview" className="mb-2 rounded max-h-36" />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              ref={fileInputRef}
              className="file:mr-2"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-1" />
            {entry ? "Update" : "Create"}
          </Button>
        </form>
      </div>
    </div>
  );
}
