// src/pages/MusicManagement.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";

interface MusicItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  category: string;
}

interface MusicListResponse {
  success: boolean;
  music: MusicItem[];
}

export default function MusicManagement() {
  const [items, setItems] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MusicItem | null>(null);

  // form state (everything except Mongo’s _id)
  const emptyForm = {
    title:       "",
    description: "",
    duration:    "",
    url:         "",
    category:    ""
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  // ─── Load all tracks ─────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<MusicListResponse>("/api/music");
      if (data.success) setItems(data.music);
      else toast.error("Failed to load music");
    } catch {
      toast.error("Error fetching music");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  // ─── Open “Add” dialog ───────────────────────────────────────
  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  // ─── Open “Edit” dialog ──────────────────────────────────────
  const openEdit = (m: MusicItem) => {
    setEditing(m);
    setForm({
      title:       m.title,
      description: m.description,
      duration:    m.duration,
      url:         m.url,
      category:    m.category
    });
    setIsDialogOpen(true);
  };

  // ─── Save (create or update) ─────────────────────────────────
  const save = async () => {
    try {
      let res;
      if (editing) {
        res = await axios.put(`/api/music/${editing.id}`, form);
      } else {
        res = await axios.post("/api/music", form);
      }
      if (res.data.success) {
        toast.success(editing ? "Track updated" : "Track created");
        setIsDialogOpen(false);
        load();
      } else {
        toast.error("Save failed");
      }
    } catch {
      toast.error("Error saving");
    }
  };

  // ─── Delete ─────────────────────────────────────────────────
  const remove = async (id: string) => {
    try {
      const res = await axios.delete(`/api/music/${id}`);
      if (res.data.success) {
        toast.success("Track deleted");
        load();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Error deleting");
    }
  };

  // ─── Simple search filter ────────────────────────────────────
  const [search, setSearch] = useState("");
  const filtered = items.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Music Management</h1>
        <div className="flex space-x-2">
          <Input
            placeholder="Search by title or category…"
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
          />
          <Button onClick={openNew}>+ Add Track</Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="whitespace-normal">{m.title}</TableCell>
                      <TableCell className="whitespace-normal">{m.description}</TableCell>
                      <TableCell>{m.duration}</TableCell>
                      <TableCell>{m.category}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEdit(m)}
                        >
                          <Edit />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(m.id)}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No tracks found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Track" : "Add Track"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration</Label>
                <Input
                  value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={save}>
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
