
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DiaryEntryForm from "@/components/DiaryEntryForm";

interface DiaryEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const HealthDiary = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  // Fetch user entries
  const fetchEntries = async () => {
    setLoading(true);
    // Use `as any` to bypass missing table types
    const { data, error } = await (supabase as any)
      .from("diary_entries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading diary", description: error.message });
    } else if (Array.isArray(data)) {
      setEntries(data as DiaryEntry[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleCreate = () => {
    setShowForm(true);
    setEditingEntry(null);
  };

  const handleEdit = (entry: DiaryEntry) => {
    setShowForm(true);
    setEditingEntry(entry);
  };

  const handleDelete = async (entry: DiaryEntry) => {
    if (!window.confirm("Delete this diary entry?")) return;
    // Use `as any` to bypass missing table types
    const { error } = await (supabase as any)
      .from("diary_entries")
      .delete()
      .eq("id", entry.id);
    if (error) {
      toast({ title: "Error deleting", description: error.message });
    } else {
      toast({ title: "Entry deleted" });
      if (entry.image_url) {
        // Try to delete the image
        const path = entry.image_url.split("/storage/v1/object/public/diary_images/")[1];
        if (path) {
          await supabase.storage.from("diary_images").remove([path]);
        }
      }
      fetchEntries();
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEntry(null);
    fetchEntries();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Health Diary
        <Button onClick={handleCreate} size="sm" className="ml-2" aria-label="Add Diary Entry">
          <Plus className="w-4 h-4" />
          New
        </Button>
      </h1>
      {showForm && (
        <DiaryEntryForm
          entry={editingEntry}
          onClose={handleFormClose}
        />
      )}
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <>
          {entries.length === 0 && <div className="mt-8 text-gray-400">No diary entries yet. Click "New" to add one!</div>}
          <div className="grid gap-6 mt-6">
            {entries.map(entry => (
              <Card key={entry.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{entry.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => handleEdit(entry)} aria-label="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDelete(entry)} aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {entry.image_url && (
                    <img 
                      src={entry.image_url} 
                      alt="Diary visual" 
                      className="mb-3 max-h-52 rounded shadow"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="whitespace-pre-wrap">{entry.content}</div>
                  <div className="text-xs text-gray-400 mt-3">
                    Updated: {new Date(entry.updated_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HealthDiary;

