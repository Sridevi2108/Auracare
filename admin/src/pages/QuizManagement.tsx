// src/pages/QuizManagement.tsx
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

// shape of a quiz item in Mongo
type QuizItem = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  category: string;
  difficulty: string;
};

// response shape from GET /api/quiz
type QuizListResponse = {
  success: boolean;
  questions: QuizItem[];
};

export default function QuizManagement() {
  const [items, setItems]           = useState<QuizItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing]       = useState<QuizItem | null>(null);
  const { toast }                   = useToast();

  // blank form template
  const emptyForm = {
    question:   "",
    options:    ["", "", "", ""],
    answer:     "",
    category:   "mental health",
    difficulty: "easy"
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  // load all quiz items from server
  const load = () => {
    setLoading(true);
    axios.get<QuizListResponse>("/api/quiz")
      .then((res: AxiosResponse<QuizListResponse>) => {
        if (res.data.success) {
          setItems(res.data.questions);
        } else {
          toast({ title: "Failed to load questions", variant: "destructive" });
        }
      })
      .catch(() => {
        toast({ title: "Error fetching questions", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // open dialog for new vs edit
  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };
  const openEdit = (q: QuizItem) => {
    setEditing(q);
    setForm({
      question:   q.question,
      options:    [...q.options],
      answer:     q.answer,
      category:   q.category,
      difficulty: q.difficulty
    });
    setIsDialogOpen(true);
  };

  // save (create or update)
  const save = () => {
    const payload = { ...form };
    const req = editing
      ? axios.put(`/api/quiz/${editing.id}`, payload)
      : axios.post("/api/quiz", payload);

    req.then(r => {
        if ((r.data as any).success) {
          toast({ title: editing ? "Updated" : "Created" });
          setIsDialogOpen(false);
          load();
        } else {
          toast({ title: "Save failed", variant: "destructive" });
        }
      })
      .catch(() => {
        toast({ title: "Error saving", variant: "destructive" });
      });
  };

  // delete
  const remove = (id: string) => {
    axios.delete(`/api/quiz/${id}`)
      .then(r => {
        if ((r.data as any).success) {
          toast({ title: "Deleted" });
          load();
        } else {
          toast({ title: "Delete failed", variant: "destructive" });
        }
      })
      .catch(() => {
        toast({ title: "Error deleting", variant: "destructive" });
      });
  };

  // simple search filter
  const [search, setSearch] = useState("");
  const filtered = items.filter(q =>
    q.question.toLowerCase().includes(search.toLowerCase()) ||
    q.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quiz Management</h1>
        <div className="flex space-x-2">
          <Input
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
          />
          <Button onClick={openNew}>+ Add Question</Button>
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
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? filtered.map(q => (
                  <TableRow key={q.id}>
                    <TableCell className="whitespace-normal">{q.question}</TableCell>
                    <TableCell>{q.category}</TableCell>
                    <TableCell>{q.difficulty}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(q)}>
                        <Edit />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(q.id)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="p-8 text-center text-muted-foreground">
                      No questions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} Question</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label>Question</Label>
              <Input
                value={form.question}
                onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {form.options.map((opt, i) => (
                <div key={i}>
                  <Label>Option {i + 1}</Label>
                  <Input
                    value={opt}
                    onChange={e => {
                      const newOpts = [...form.options];
                      newOpts[i] = e.target.value;
                      setForm(f => ({ ...f, options: newOpts }));
                    }}
                  />
                </div>
              ))}
            </div>

            <div>
              <Label>Correct Answer</Label>
              <select
                className="w-full p-2 border rounded"
                value={form.answer}
                onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
              >
                <option value="">— choose —</option>
                {form.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={form.difficulty}
                  onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                >
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={save}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
